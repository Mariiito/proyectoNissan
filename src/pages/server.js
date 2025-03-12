import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { pbkdf2Sync, randomBytes } from 'crypto';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

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
  password: '',
  database: 'railway'
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
        C.id AS ID,
        C.name AS Nombre,
        C.description AS Descripción,
        SA.name AS Subcuenta,
        CTw.name AS CredencialTwilio,
        CGcp.name AS CredencialGcp,
        COUNT(DISTINCT T.id) AS Plantillas,
        COUNT(DISTINCT S.id) AS Sheets,
        DATE_FORMAT(C.created_at, '%d/%m/%Y, %H:%i:%s') AS Creado,
        DATE_FORMAT(C.updated_at, '%d/%m/%Y, %H:%i:%s') AS Actualizado
      FROM
          Campaign AS C
      LEFT JOIN
          sub_accounts AS SA ON C.sub_account_id = SA.id
      LEFT JOIN
          credentials AS CTw ON C.credential_template_id = CTw.id
      LEFT JOIN
          credentials AS CGcp ON C.credential_sheet_id = CGcp.id
      LEFT JOIN
          Templates AS T ON C.id = T.campaign_id
      LEFT JOIN
          Sheets AS S ON C.id = S.campaign_id
      GROUP BY
          C.id, C.name, C.description, SA.name, CTw.name, CGcp.name, C.created_at, C.updated_at
      ORDER BY
          C.id;
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
          number_phones;
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

// Esta debe ser la última línea de tu archivo, después de todos los endpoints
app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});


