import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const app = express();

connectDB();

const __dirname = path.resolve();

app.use(cors({
  origin: ['http://127.0.0.1:3000', 'http://localhost:3001'], // Allow both origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'application/json'],
  credentials: true  // Required for cookies
}));// Enable CORS

app.use(express.static(path.join(__dirname, '/client/dist')));
const port = process.env.PORT;

// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
// });

app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({extended:true}));

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/',(req,res)=>res.send("server is ready"))

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

app.listen(port, () => {
  console.log(`Server listening http://127.0.0.1:${port}`);
});