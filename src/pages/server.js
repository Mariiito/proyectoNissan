import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import { pbkdf2Sync, randomBytes } from 'crypto';
import cookieParser from 'cookie-parser'; // Importa cookie-parser
import jwt from 'jsonwebtoken'; // Importa jsonwebtoken

const app = express();
const port = 3001;
const secretKey = 'tu_secreto'; // Cambia esto por una clave secreta segura

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true // Permite el envío de cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser()); // Usa cookie-parser middleware

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'railway'
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
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
        // Generar un token JWT
        const token = jwt.sign({ email: user.email }, secretKey, { expiresIn: '1h' });

        // Enviar el token como una cookie
        res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'Strict' }); // Ajusta secure y sameSite según tu entorno
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
      } else {
        return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
      }
    } else {
      return res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos.' });
    }
  });
});

// Endpoint para obtener el email del usuario autenticado
app.get('/user-email', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No se proporcionó token.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido.' });
    }

    // El token es válido, extraer el email del payload
    const email = decoded.email;
    return res.status(200).json({ email });
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
      FROM Campaign AS C 
      LEFT JOIN sub_accounts AS SA ON C.sub_account_id = SA.id 
      LEFT JOIN credentials AS CTw ON C.credential_template_id = CTw.id 
      LEFT JOIN credentials AS CGcp ON C.credential_sheet_id = CGcp.id 
      LEFT JOIN Templates AS T ON C.id = T.campaign_id 
      LEFT JOIN Sheets AS S ON C.id = S.campaign_id 
      GROUP BY C.id, C.name, C.description, SA.name, CTw.name, CGcp.name, Creado, Actualizado 
      ORDER BY C.id;
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
      FROM number_phones;
    `);

    res.status(200).json(results);
  } catch (err) {
    console.error('Error al ejecutar la consulta:', err);
    res.status(500).json({ message: 'Error al obtener los números telefónicos.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
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
        last_login
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