require('dotenv').config();

const path = require('path');
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'the_movie',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306
};

let pool;

async function ensureDatabaseExists() {
  try {
    const { database, ...connectionConfig } = dbConfig;
    const connection = await mysql.createConnection(connectionConfig);
    try {
      await connection.query(
        `CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
      );
      console.log(`Ensured database "${database}" exists.`);
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('Error ensuring database exists:', error);
    throw error;
  }
}

async function initDb() {
  const createTableSql = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(20)
    )
  `;

  await ensureDatabaseExists();

  pool = mysql.createPool({
    ...dbConfig,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    const connection = await pool.getConnection();
    try {
      await connection.query(createTableSql);
      console.log('Ensured users table exists.');
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ message: 'API is running' });
});

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, email, phone } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const sql = `
      INSERT INTO users (username, password, email, phone)
      VALUES (?, ?, ?, ?)
    `;

    const values = [username, passwordHash, email || null, phone || null];

    const connection = await pool.getConnection();
    try {
      await connection.execute(sql, values);
    } finally {
      connection.release();
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    if (error && error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Username already exists' });
    }

    console.error('Error registering user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: 'Username and password are required' });
  }

  try {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT id, username, password FROM users WHERE username = ? LIMIT 1',
        [username]
      );

      if (!rows || rows.length === 0) {
        return res.status(401).json({ error: 'User not found' });
      }

      const user = rows[0];

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      return res.json({
        message: 'Login successful',
        username: user.username
      });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Example route that tests DB connection
app.get('/db-test', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS result');
    res.json({ db: 'connected', result: rows[0].result });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

async function startServer() {
  await initDb();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();

