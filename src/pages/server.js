import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import axios from 'axios';
import { pbkdf2Sync, randomBytes } from 'crypto';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import twilio from 'twilio';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const app = express();
const port = 3001;
const secretKey = 'tu_secreto';


// Configuración de CORS (permitiendo cualquier origen en desarrollo)
const corsOptions = {
  origin: '*', // Permitir cualquier origen (¡solo para desarrollo!)
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'railway2'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Importante: Salir si no se puede conectar a la base de datos
  } else {
    console.log('Conexión a la base de datos establecida.');
  }
});

function verifyPassword(password, hashedPassword) {
  const parts = hashedPassword.split('$');
  const iterations = parts[1];
  const salt = parts[2];
  const hash = parts[3];

  const derivedKey = pbkdf2Sync(password, salt, parseInt(iterations), 32, 'sha256').toString('base64');

  return hash === derivedKey;
}

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';

  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta:', err);
      return res.status(500).json({ message: 'Error al verificar las credenciales.' });
    }

    if (results.length > 0) {
      const user = results[0];
      const isMatch = verifyPassword(password, user.password);

      if (isMatch) {
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

        res.cookie('token', token, {
          httpOnly: true,
          secure: false,
          sameSite: 'Lax',
        });
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
      }
    } else {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }
  });
});

app.get('/user-email', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    const email = decoded.email;
    return res.status(200).json({ email });
  });
});

app.post('/sub_accounts', async (req, res) => {
  const { email, nombreSubcuenta } = req.body;

  if (!email || !nombreSubcuenta) {
    return res.status(400).json({ message: 'Correo electrónico y nombre de subcuenta son requeridos.' });
  }

  // Primero, buscar el ID del usuario basado en el correo electrónico
  const findUserQuery = 'SELECT id FROM users WHERE email = ?';

  db.query(findUserQuery, [email], (findUserErr, findUserResults) => {
    if (findUserErr) {
      console.error('Error al buscar el usuario:', findUserErr);
      return res.status(500).json({ message: 'Error al buscar el usuario.' });
    }

    if (findUserResults.length === 0) {
      return res.status(404).json({ message: 'No se encontró ningún usuario con ese correo electrónico.' });
    }

    const userId = findUserResults[0].id;

    // Luego, insertar la nueva subcuenta con el ID del usuario
    const insertSubcuentaQuery = 'INSERT INTO sub_accounts (name, created_at, updated_at, user_id) VALUES (?, NOW(), NOW(), ?)';

    db.query(insertSubcuentaQuery, [nombreSubcuenta, userId], (insertErr, insertResults) => {
      if (insertErr) {
        console.error('Error al crear la subcuenta:', insertErr);
        return res.status(500).json({ message: 'Error al crear la subcuenta.' });
      }

      console.log('Subcuenta creada con ID:', insertResults.insertId);
      res.status(201).json({ message: 'Subcuenta creada exitosamente.' });
    });
  });
});

app.get('/campaigns', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT 
        c.id AS ID,
        c.name AS Nombre,
        c.description AS Descripción,
        c.sub_account_id AS Subcuenta,
        COUNT(DISTINCT t.id) AS CredencialTwilio,
        COUNT(DISTINCT s.id) AS CredencialGcp,
        COALESCE(COUNT(DISTINCT t.id), 0) AS Plantillas,
        COALESCE(COUNT(DISTINCT s.id), 0) AS Sheets,
        DATE_FORMAT(c.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(c.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado,
        'Editar' AS Acciones
      FROM 
        Campaign c
      LEFT JOIN 
        Templates t ON c.id = t.campaign_id
      LEFT JOIN 
        Sheets s ON c.id = s.campaign_id
      GROUP BY 
        c.id, c.name, c.description, c.sub_account_id, c.created_at, c.updated_at
      ORDER BY 
        c.id DESC;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las campañas.' });
  }
});

app.get('/number_phones', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT
          id,
          name AS nombre,
          company AS compania,
          number AS numero,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones
      ORDER BY
          id DESC;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos.' });
  }
});


app.get('/number_phones_formatted', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT
          id,
          name AS nombre,
          company AS compania,
          CONCAT('+52 ', number) AS numero,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones
      ORDER BY
          id DESC;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos.' });
  }
});

app.post('/number_phones', async (req, res) => {
  const { name, company, number } = req.body;

  if (!name || !company || !number) {
    return res.status(400).json({ message: 'Nombre, compañía y número son requeridos.' });
  }

  const insertNumberPhoneQuery = 'INSERT INTO number_phones (name, company, number, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';

  db.query(insertNumberPhoneQuery, [name, company, number], (insertErr, insertResults) => {
    if (insertErr) {
      console.error('Error al crear el número telefónico:', insertErr);
      return res.status(500).json({ message: 'Error al crear el número telefónico.' });
    }

    console.log('Número telefónico creado con ID:', insertResults.insertId);
    res.status(201).json({ message: 'Número telefónico creado exitosamente.' });
  });
});



app.get('/sub_accounts', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT
          id,
          user_id AS Usuario,
          name AS Nombre,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
          sub_accounts;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las subcuentas.' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT
          id,
          username,
          email,
          first_name,
          last_name,
          is_superuser,
          is_active,
          DATE_FORMAT(date_joined, '%d/%m/%Y, %H:%i:%s') AS date_joined,
          DATE_FORMAT(last_login, '%d/%m/%Y, %H:%i:%s') AS last_login 
      FROM users;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los usuarios.' });
  }
});

app.get('/credentials', async (req, res) => {
  try {
    const [results, fields] = await db.promise().query(`
      SELECT
          id,
          name,
          json,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS created_at,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS updated_at
      FROM credentials;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las credenciales.' });
  }
});


// Endpoint para crear credenciales
app.post('/credentials', async (req, res) => {
  const { name, json } = req.body;

  if (!name || !json) {
    return res.status(400).json({ message: 'Nombre y JSON son requeridos.' });
  }

  const insertCredentialQuery = 'INSERT INTO credentials (name, json, created_at, updated_at) VALUES (?, ?, NOW(), NOW())';

  db.query(insertCredentialQuery, [name, json], (insertErr, insertResults) => {
    if (insertErr) {
      console.error('Error al crear la credencial:', insertErr);
      return res.status(500).json({ message: 'Error al crear la credencial.' });
    }

    console.log('Credencial creada con ID:', insertResults.insertId);
    res.status(201).json({ message: 'Credencial creada exitosamente.' });
  });
});


// Endpoint para obtener subcuentas por usuario (usar email)
app.get('/sub_accounts_by_user', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ message: 'Email es requerido.' });
  }

  try {
    // Primero obtenemos el ID del usuario
    const [userResults] = await db.promise().query('SELECT id FROM users WHERE email = ?', [email]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    const userId = userResults[0].id;

    // Luego obtenemos las subcuentas de ese usuario
    const [results] = await db.promise().query(`
      SELECT
          id,
          user_id AS Usuario,
          name AS Nombre,
          DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
          DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
          sub_accounts
      WHERE
          user_id = ?
    `, [userId]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las subcuentas del usuario.' });
  }
});

// Endpoint para obtener campañas asociadas a una subcuenta
app.get('/campaigns_by_sub_account/:sub_account_id', async (req, res) => {
  const { sub_account_id } = req.params;

  // Validar que el ID sea un número entero
  if (!sub_account_id || isNaN(Number(sub_account_id))) {
    return res.status(400).json({ message: 'ID de subcuenta inválido' });
  }

  try {
    const sql = `
      SELECT 
        c.id AS ID,
        c.name AS Nombre,
        c.description AS Descripción,
        c.sub_account_id AS Subcuenta,
        COUNT(DISTINCT t.id) AS CredencialTwilio,
        COUNT(DISTINCT s.id) AS CredencialGcp,
        COALESCE(COUNT(DISTINCT t.id), 0) AS Plantillas,
        COALESCE(COUNT(DISTINCT s.id), 0) AS Sheets,
        DATE_FORMAT(c.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(c.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado,
        'Editar' AS Acciones
      FROM 
        Campaign c
      LEFT JOIN 
        Templates t ON c.id = t.campaign_id
      LEFT JOIN 
        Sheets s ON c.id = s.campaign_id
      WHERE 
        c.sub_account_id = ${db.escape(sub_account_id)} 
      GROUP BY 
        c.id, c.name, c.description, c.sub_account_id, c.created_at, c.updated_at
      ORDER BY 
        c.id DESC;
    `;

    const [results] = await db.promise().query(sql);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener las campañas.' });
  }
});

// Endpoint para obtener plantillas asociadas a una campaña
app.get('/templates_by_campaign/:campaign_id', async (req, res) => {
  const { campaign_id } = req.params;

  if (!campaign_id || isNaN(Number(campaign_id))) {
    return res.status(400).json({ message: 'ID de campaña inválido' });
  }

  try {
    const sql = `
      SELECT 
        t.id AS ID,
        t.name AS Nombre,
        t.associated_fields AS Campos,
        t.sid AS sid,           
        t.campaign_id AS Campana,
        DATE_FORMAT(t.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(t.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM 
        Templates t
      WHERE 
        t.campaign_id = ${db.escape(campaign_id)} 
      ORDER BY 
        t.id DESC;
    `;

    const [results] = await db.promise().query(sql);
    res.status(200).json(results);  // Devolver los resultados
  } catch (err) {
    console.error('Error al obtener las plantillas:', err);
    res.status(500).json({ message: 'Error al obtener las plantillas.' });
  }
});



// Endpoint para asociar números telefónicos a una subcuenta
app.post('/associate_number_phone', async (req, res) => {
  const { sub_account_id, number_phone_id } = req.body;

  if (!sub_account_id || !number_phone_id) {
    return res.status(400).json({ message: 'ID de subcuenta y ID de número telefónico son requeridos.' });
  }

  try {
    // Verificar que la subcuenta existe
    const [subAccountResults] = await db.promise().query('SELECT id FROM sub_accounts WHERE id = ?', [sub_account_id]);

    if (subAccountResults.length === 0) {
      return res.status(404).json({ message: 'Subcuenta no encontrada.' });
    }

    // Verificar que el número telefónico existe
    const [numberPhoneResults] = await db.promise().query('SELECT id FROM number_phones WHERE id = ?', [number_phone_id]);

    if (numberPhoneResults.length === 0) {
      return res.status(404).json({ message: 'Número telefónico no encontrado.' });
    }

    // Crear la asociación en la tabla correspondiente (asumiendo que existe una tabla para esta relación)
    const [result] = await db.promise().query(`
      INSERT INTO sub_account_number_phones (sub_account_id, number_phone_id, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [sub_account_id, number_phone_id]);

    res.status(201).json({ message: 'Número telefónico asociado exitosamente a la subcuenta.' });
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al asociar el número telefónico a la subcuenta.' });
  }
});

// Endpoint para obtener números telefónicos asociados a una subcuenta
app.get('/number_phones_by_sub_account', async (req, res) => {
  const { sub_account_id } = req.query;

  if (!sub_account_id) {
    return res.status(400).json({ message: 'ID de subcuenta es requerido.' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT
          np.id,
          np.name AS nombre,
          np.company AS compania,
          np.number AS numero,
          DATE_FORMAT(np.created_at, '%d/%m/%Y, %H:%i:%s') AS creado,
          DATE_FORMAT(np.updated_at, '%d/%m/%Y, %H:%i:%s') AS actualizado
      FROM
          number_phones np
      JOIN
          sub_account_number_phones sanp ON np.id = sanp.number_phone_id
      WHERE
          sanp.sub_account_id = ?
    `, [sub_account_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos de la subcuenta.' });
  }
});

// Endpoint para asociar credenciales a una subcuenta
app.post('/associate_credential', async (req, res) => {
  const { sub_account_id, credentials_id } = req.body;

  if (!sub_account_id || !credentials_id) {
    return res.status(400).json({ message: 'ID de subcuenta y ID de credencial son requeridos.' });
  }

  try {
    // Verificar que la subcuenta existe
    const [subAccountResults] = await db.promise().query('SELECT id FROM sub_accounts WHERE id = ?', [sub_account_id]);

    if (subAccountResults.length === 0) {
      return res.status(404).json({ message: 'Subcuenta no encontrada.' });
    }

    // Verificar que la credencial existe
    const [credentialResults] = await db.promise().query('SELECT id FROM credentials WHERE id = ?', [credentials_id]);

    if (credentialResults.length === 0) {
      return res.status(404).json({ message: 'Credencial no encontrada.' });
    }

    // Crear la asociación en la tabla sub_account_credentials
    const [result] = await db.promise().query(`
      INSERT INTO sub_account_credentials (sub_account_id, credentials_id, created_at, updated_at)
      VALUES (?, ?, NOW(), NOW())
    `, [sub_account_id, credentials_id]);

    res.status(201).json({ message: 'Credencial asociada exitosamente a la subcuenta.' });
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al asociar la credencial a la subcuenta.' });
  }
});

app.delete('/cleanup-credentials', async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      DELETE FROM credentials
      WHERE name = 'no'
    `);

    console.log(`Se eliminaron ${result.affectedRows} credenciales no deseadas.`);

    res.status(200).json({
      message: `Se eliminaron ${result.affectedRows} credenciales no deseadas.`,
      affectedRows: result.affectedRows
    });
  } catch (err) {
    console.error('Error al limpiar las credenciales:', err);
    res.status(500).json({ message: 'Error al limpiar las credenciales.' });
  }
});

// Endpoint para crear campañas
// Endpoint para crear campañas
app.post('/campaigns', async (req, res) => {
  const { name, description, sub_account_id, credential_sheet_id, credential_template_id } = req.body;

  if (!name || !sub_account_id || !credential_sheet_id || !credential_template_id) {
    return res.status(400).json({ message: 'Nombre, subcuenta y credenciales son requeridos.' });
  }

  try {
    // Verificar que la subcuenta existe
    const [subAccountResults] = await db.promise().query('SELECT id FROM sub_accounts WHERE id = ?', [sub_account_id]);

    if (subAccountResults.length === 0) {
      return res.status(404).json({ message: 'Subcuenta no encontrada.' });
    }

    // Verificar que las credenciales existen
    const [sheetCredentialResults] = await db.promise().query('SELECT id FROM credentials WHERE id = ?', [credential_sheet_id]);

    if (sheetCredentialResults.length === 0) {
      return res.status(404).json({ message: 'Credencial para Google Sheets no encontrada.' });
    }

    const [templateCredentialResults] = await db.promise().query('SELECT id FROM credentials WHERE id = ?', [credential_template_id]);

    if (templateCredentialResults.length === 0) {
      return res.status(404).json({ message: 'Credencial para mensajes no encontrada.' });
    }

    // Insertar la nueva campaña
    const [result] = await db.promise().query(`
      INSERT INTO Campaign (name, description, sub_account_id, credential_sheet_id, credential_template_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, NOW(), NOW())
    `, [name, description, sub_account_id, credential_sheet_id, credential_template_id]);

    res.status(201).json({
      message: 'Campaña creada exitosamente.',
      id: result.insertId
    });
  } catch (err) {
    console.error('Error al crear la campaña:', err);
    res.status(500).json({ message: 'Error al crear la campaña.' });
  }
});

// Endpoint para obtener los campos de una plantilla específica
app.get('/template_fields/:template_id', async (req, res) => {
  const { template_id } = req.params;

  if (!template_id) {
    return res.status(400).json({ message: 'ID de plantilla es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE id = ?
    `, [template_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Plantilla no encontrada' });
    }

    // Parsear associated_fields que es un objeto JSON almacenado como string
    const template = results[0];
    let associatedFields = {};

    try {
      if (template.associated_fields) {
        associatedFields = JSON.parse(template.associated_fields);
      }
    } catch (parseError) {
      console.error('Error al parsear associated_fields:', parseError);
    }

    res.status(200).json({
      id: template.id,
      name: template.name,
      sid: template.sid,
      associated_fields: associatedFields
    });
  } catch (err) {
    console.error('Error al obtener los campos de la plantilla:', err);
    res.status(500).json({ message: 'Error al obtener los campos de la plantilla' });
  }
});

// Endpoint para obtener las columnas de una hoja de Google Sheets
app.get('/sheet_columns/:sheet_id', async (req, res) => {
  const { sheet_id } = req.params;

  if (!sheet_id) {
    return res.status(400).json({ message: 'ID del Sheets es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact
      FROM Sheets
      WHERE id = ?
    `, [sheet_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Hoja no encontrada' });
    }

    // Aquí normalmente conectarías con la API de Google Sheets para obtener las columnas
    // Por simplicidad, retornaremos algunos campos fijos basados en los datos que vimos
    const defaultColumns = [
      'Lista_Negra',
      'WhastApp',
      'Celular',
      'Nombre del Asegurado',
      'Nombre de la Aseguradora',
      'Orden',
      'Unidad',
      'No. de Serie'
    ];

    res.status(200).json({
      sheet: results[0],
      columns: defaultColumns
    });
  } catch (err) {
    console.error('Error al obtener las columnas de la hoja:', err);
    res.status(500).json({ message: 'Error al obtener las columnas de la hoja' });
  }
});

// Endpoint para asociar campos entre plantillas y hojas
app.post('/associate_fields', async (req, res) => {
  const {
    campaign_id,
    sheet_id,
    field_mappings,
    template_id,
    field_blacklist,
    field_status,
    field_contact
  } = req.body;

  if (!campaign_id || !sheet_id || !template_id) {
    return res.status(400).json({ message: 'ID de campaña, ID de hoja y ID de plantilla son requeridos' });
  }

  try {
    // 1. Actualizar la tabla Sheets con la información de los campos
    await db.promise().query(`
      UPDATE Sheets
      SET field_blacklist = ?,
          field_status = ?,
          field_contact = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `, [field_blacklist, field_status, field_contact, sheet_id, campaign_id]);

    // 2. Actualizar la tabla Templates con el mapeo de campos
    // Convertir el objeto field_mappings a JSON string
    const associated_fields_json = JSON.stringify(field_mappings);

    await db.promise().query(`
      UPDATE Templates
      SET associated_fields = ?,
          updated_at = NOW()
      WHERE id = ? AND campaign_id = ?
    `, [associated_fields_json, template_id, campaign_id]);

    res.status(200).json({
      message: 'Campos asociados exitosamente',
      updated: {
        sheet: { id: sheet_id, field_blacklist, field_status, field_contact },
        template: { id: template_id, associated_fields: field_mappings }
      }
    });
  } catch (err) {
    console.error('Error al asociar los campos:', err);
    res.status(500).json({ message: 'Error al asociar los campos' });
  }
});

// Endpoint para obtener las plantillas disponibles para una campaña
app.get('/templates_by_campaign/:campaign_id', async (req, res) => {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res.status(400).json({ message: 'ID de campaña es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, name, associated_fields, sid
      FROM Templates
      WHERE campaign_id = ?
    `, [campaign_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener las plantillas:', err);
    res.status(500).json({ message: 'Error al obtener las plantillas de la campaña' });
  }
});

// Endpoint para obtener las hojas asociadas a una campaña
app.get('/sheets_by_campaign/:campaign_id', async (req, res) => {
  const { campaign_id } = req.params;

  if (!campaign_id) {
    return res.status(400).json({ message: 'ID de campaña es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact
      FROM Sheets
      WHERE campaign_id = ?
    `, [campaign_id]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener las hojas:', err);
    res.status(500).json({ message: 'Error al obtener las hojas de la campaña' });
  }
});


// Endpoint para actualizar un usuario por su ID
app.put('/users/:id', async (req, res) => {
  const userId = req.params.id;
  const { username, email, first_name, last_name, is_superuser, is_active } = req.body;

  if (!userId) {
    return res.status(400).json({ message: 'ID de usuario es requerido.' });
  }

  try {
    // Verificar que el usuario existe
    const [userResults] = await db.promise().query('SELECT id FROM users WHERE id = ?', [userId]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado.' });
    }

    // Actualizar los datos del usuario
    const [result] = await db.promise().query(`
      UPDATE users
      SET 
        username = ?,
        email = ?,
        first_name = ?,
        last_name = ?,
        is_superuser = ?,
        is_active = ?
      WHERE id = ?
    `, [username, email, first_name, last_name, is_superuser, is_active, userId]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar el usuario.' });
    }

    res.status(200).json({
      message: 'Usuario actualizado exitosamente.',
      userId: userId
    });
  } catch (err) {
    console.error('Error al actualizar el usuario:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario.' });
  }
});

app.put('/sub_accounts/:id', async (req, res) => {
  const subcuentaId = req.params.id;
  const { nombre } = req.body;  // Solo usar el nombre, ignorar el usuario

  if (!subcuentaId) {
    return res.status(400).json({ message: 'ID de subcuenta es requerido.' });
  }

  try {
    // Verificar que la subcuenta existe
    const [subcuentaResults] = await db.promise().query('SELECT id FROM sub_accounts WHERE id = ?', [subcuentaId]);

    if (subcuentaResults.length === 0) {
      return res.status(404).json({ message: 'Subcuenta no encontrada.' });
    }

    // Actualizar solo el nombre de la subcuenta
    const [result] = await db.promise().query(`
      UPDATE sub_accounts
      SET 
        name = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [nombre, subcuentaId]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar la subcuenta.' });
    }

    res.status(200).json({
      message: 'Subcuenta actualizada exitosamente.',
      subcuentaId: subcuentaId
    });
  } catch (err) {
    console.error('Error al actualizar la subcuenta:', err);
    res.status(500).json({ message: 'Error al actualizar la subcuenta.' });
  }
});


// Endpoint para actualizar números telefónicos
app.put('/number_phones/:id', async (req, res) => {
  const phoneId = req.params.id;
  const { name, company, number } = req.body;

  if (!phoneId) {
    return res.status(400).json({ message: 'ID de número telefónico es requerido.' });
  }

  try {
    // Verificar que el número telefónico existe
    const [phoneResults] = await db.promise().query('SELECT id FROM number_phones WHERE id = ?', [phoneId]);

    if (phoneResults.length === 0) {
      return res.status(404).json({ message: 'Número telefónico no encontrado.' });
    }

    // Actualizar los datos del número telefónico
    const [result] = await db.promise().query(`
      UPDATE number_phones
      SET 
        name = ?,
        company = ?,
        number = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [name, company, number, phoneId]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar el número telefónico.' });
    }

    res.status(200).json({
      message: 'Número telefónico actualizado exitosamente.',
      phoneId: phoneId
    });
  } catch (err) {
    console.error('Error al actualizar el número telefónico:', err);
    res.status(500).json({ message: 'Error al actualizar el número telefónico.' });
  }
});

// Endpoint para actualizar credenciales
app.put('/credentials/:id', async (req, res) => {
  const credentialId = req.params.id;
  const { name, json } = req.body;

  if (!credentialId) {
    return res.status(400).json({ message: 'ID de credencial es requerido.' });
  }

  try {
    // Verificar que la credencial existe
    const [credentialResults] = await db.promise().query('SELECT id FROM credentials WHERE id = ?', [credentialId]);

    if (credentialResults.length === 0) {
      return res.status(404).json({ message: 'Credencial no encontrada.' });
    }

    // Validar que el JSON sea válido
    try {
      // Verificar si ya es un string JSON o es un objeto
      let jsonString = json;
      if (typeof json === 'object') {
        jsonString = JSON.stringify(json);
      } else {
        // Verificar que es un JSON válido tratando de parsearlo
        JSON.parse(json);
      }
    } catch (e) {
      return res.status(400).json({ message: 'El formato JSON no es válido.' });
    }

    // Actualizar los datos de la credencial
    const [result] = await db.promise().query(`
      UPDATE credentials
      SET 
        name = ?,
        json = ?,
        updated_at = NOW()
      WHERE id = ?
    `, [name, json, credentialId]);

    if (result.affectedRows === 0) {
      return res.status(500).json({ message: 'No se pudo actualizar la credencial.' });
    }

    res.status(200).json({
      message: 'Credencial actualizada exitosamente.',
      credentialId: credentialId
    });
  } catch (err) {
    console.error('Error al actualizar la credencial:', err);
    res.status(500).json({ message: 'Error al actualizar la credencial.' });
  }
});

// Endpoint para obtener las plantillas asociadas a una campaña
app.get('/templates_by_campaign/:campaign_id', async (req, res) => {
  const campaignId = req.params.campaign_id;

  if (!campaignId) {
    return res.status(400).json({ message: 'ID de campaña es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, name, associated_fields, sid, 
             DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS created_at, 
             DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS updated_at, 
             campaign_id
      FROM Templates
      WHERE campaign_id = ?
    `, [campaignId]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener las plantillas:', err);
    res.status(500).json({ message: 'Error al obtener las plantillas de la campaña' });
  }
});

// Endpoint para obtener las hojas asociadas a una campaña
app.get('/sheets_by_campaign/:campaign_id', async (req, res) => {
  const campaignId = req.params.campaign_id;

  if (!campaignId) {
    return res.status(400).json({ message: 'ID de campaña es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact,
             DATE_FORMAT(created_at, '%d/%m/%Y, %H:%i:%s') AS created_at, 
             DATE_FORMAT(updated_at, '%d/%m/%Y, %H:%i:%s') AS updated_at, 
             campaign_id
      FROM Sheets
      WHERE campaign_id = ?
    `, [campaignId]);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al obtener las hojas:', err);
    res.status(500).json({ message: 'Error al obtener las hojas de la campaña' });
  }
});
// Esta debe ser la última línea de tu archivo, después de todos los endpoints
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});

// ...existing code...

app.get('/sheet/:sheetId', async (req, res) => {
  const { sheetId } = req.params;
  const { campaignId, sheetName, range } = req.query; // Obtener sheetName y range de los parámetros de consulta

  if (!sheetId || !campaignId || !sheetName || !range) {
    return res.status(400).json({ message: 'ID de hoja, ID de campaña, nombre de la hoja y rango son requeridos' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, sheet_id, sheet_sheet, sheet_range, field_blacklist, field_status, field_contact, campaign_id
      FROM Sheets
      WHERE sheet_id = ${db.escape(sheetId)} AND campaign_id = ${db.escape(campaignId)}
    `);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Hoja no encontrada o no pertenece a la campaña seleccionada' });
    }

    // Autenticar y obtener datos de Google Sheets
    const authClient = await authenticateGoogleSheets();
    const sheets = google.sheets({ version: 'v4', auth: authClient });

    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `'${sheetName}'!${range}`  // Forzar la interpretación como nombre de hoja
      });

      // Validar que se tiene acceso a la información
      if (response.status !== 200) {
        return res.status(403).json({ message: 'No se tiene acceso a la información de la hoja' });
      }

      res.status(200).json({ ...results[0], sheetData: response.data.values });
    } catch (error) {
      console.error('Error al acceder a Google Sheets:', error);
      return res.status(500).json({ message: 'Error al acceder a Google Sheets' });
    }
  } catch (err) {
    console.error('Error al acceder al Sheets:', err);
    res.status(500).json({ message: 'Error al acceder al Sheets' });
  }
});


// Función para autenticar con Google Sheets API
const authenticateGoogleSheets = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: '../../config_keys.json', // Ruta correcta al archivo de cuenta de servicio
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  return await auth.getClient();
};


app.get('/templates_by_sid/:sid', async (req, res) => {
  const { sid } = req.params;

  if (!sid) {
    return res.status(400).json({ message: 'SID de plantilla es requerido' });
  }

  try {
    const [results] = await db.promise().query(`
      SELECT id, name, associated_fields, sid, created_at, updated_at, campaign_id
      FROM Templates
      WHERE sid = ${db.escape(plantillaNombre)}
    `, [plantillaNombre]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'Plantilla no encontrada' });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error('Error al obtener la plantilla:', err);
    res.status(500).json({ message: 'Error al obtener la plantilla' });
  }
});

app.get('/twilio_template/:sid', async (req, res) => {
  const { sid } = req.params;

  if (!sid) {
    return res.status(400).json({ message: 'SID de plantilla es requerido' });
  }

  try {

    // Usar la API de Content Templates
    const template = await client.content.v1.contentTemplates(sid).fetch();

    res.status(200).json({
      friendly_name: template.friendlyName,
      types: template.types,
      variables: template.variables || {}
    });
  } catch (err) {
    console.error('Error al obtener la plantilla de Twilio:', err.message);
    res.status(500).json({ message: 'Error al obtener la plantilla de Twilio' });
  }
});

const fetchTwilioCredentials = async () => {
  console.log("🔍 Buscando credenciales de Twilio globales");

  const [results] = await db.promise().query(
    `SELECT c.json FROM credentials c
     WHERE c.name LIKE '%Twilio%'`
  );

  if (results.length === 0) {
    console.error("❌ No se encontraron credenciales de Twilio.");
    throw new Error('No se encontraron credenciales de Twilio');
  }

  const credentials = JSON.parse(results[0].json);
  console.log("✅ Credenciales obtenidas:", credentials);

  if (!credentials.account_sid || !credentials.auth_token) {
    throw new Error('❌ Credenciales de Twilio inválidas');
  }

  return {
    twilio_sid: credentials.account_sid,
    twilio_auth_token: credentials.auth_token
  };
};



app.get('/twilio-template/:subAccountId/:templateSid', async (req, res) => {
  const { subAccountId, templateSid } = req.params;

  console.log(`📌 Buscando plantilla con SID: ${templateSid} para subAccountId: ${subAccountId}`);

  try {
    if (!subAccountId) {
      console.error("❌ subAccountId no recibido en la petición");
      return res.status(400).json({ message: "subAccountId es requerido" });
    }

    const { twilio_sid, twilio_auth_token } = await fetchTwilioCredentials(subAccountId);

    console.log("🔑 Usando credenciales de Twilio:", { twilio_sid });
    console.log({twilio_sid});
    console.log({twilio_auth_token});

    const url = `https://console.twilio.com/v1/ContentTemplates/${templateSid}`;
    const response = await axios.get(url, {
      auth: {
        username: twilio_sid,
        password: twilio_auth_token
      }
    });

    console.log("✅ Plantilla obtenida correctamente:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error al obtener la plantilla dxxxxxe Twilio:", error.response?.data || error.message);
    res.status(500).json({ message: "Error al obtener la plantilla de Twilio", error: error.response?.data || error.message });
  }
});


app.get('/twilio-template/:templateSid', async (req, res) => {
  const { templateSid } = req.params;

  console.log(`📌 Buscando plantilla con SID: ${templateSid}`);

  try {
    // Obtener credenciales de Twilio (sin subAccountId)
    const { twilio_sid, twilio_auth_token } = await fetchTwilioCredentials(); // Ajusta esta función si es necesario

    console.log("🔑 Usando credenciales de Twilio:", { twilio_sid });

    const url = `https://content.twilio.com/v1/ContentTemplates/${templateSid}`;
    const response = await axios.get(url, {
      auth: {
        username: twilio_sid,
        password: twilio_auth_token
      }
    });

    console.log("✅ Plantilla obtenida correctamente:", response.data);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error al obtener la plantilla de Twilio:", error.response?.data || error.message);
    res.status(500).json({ message: "Error al obtener la plantilla de Twilio", error: error.response?.data || error.message });
  }
});












// Hola, mundo!