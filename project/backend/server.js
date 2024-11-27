import express, { json } from 'express';
import mssql from 'mssql';
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables from .env

const ConnectionPool = mssql.ConnectionPool;
import userRoutes from './routes/userRoutes.js';
import UserController from './controller/userController.js';

const app = express();
const PORT = process.env.PORT || 3008;

const pool = new ConnectionPool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
});

pool.connect(err => {
  if (err) {
    console.error('Error connecting to SQL Server:', err);
  } else {
    console.log('Connected to SQL Server');
  }
});

const userController = new UserController(pool);

app.use(json());
app.use(cors({
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow only these methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow only these headers
}));
app.use('/api', userRoutes(userController));

app.get('/', (req, res) => {
  res.send('Welcome to the user API!');
});

app.listen(PORT, () => {
  console.log('Servidor rodando na porta', PORT);
});