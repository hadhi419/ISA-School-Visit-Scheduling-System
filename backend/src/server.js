import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import visitsRoutes from './routes/visitRoutes.js';
import approvalRoutes from './routes/approvalRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import visitPdfRoutes from './routes/visitPdfRoutes.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Replace __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base upload folder
export const UPLOAD_BASE = path.join(__dirname, '..', 'uploads');

// Subfolders you want
const folders = ['documents', 'photos'];

// Ensure the base folder exists
if (!fs.existsSync(uploadBase)) {
  fs.mkdirSync(uploadBase, { recursive: true });
}

// Ensure each subfolder exists
folders.forEach((folder) => {
  const folderPath = path.join(uploadBase, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
});

console.log('Upload folders are ready!');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use('/api/auth', authRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/visits', visitsRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/visits', visitPdfRoutes);

import bcrypt from 'bcryptjs';

async function hashed() {
  const password = '123456';
  const hashed = await bcrypt.hash(password, 10);
  // ////console.log(hashed);
}

app.get('/', async (req, res) => {
  try {
    hashed();
    const [rows] = await db.query('SELECT NOW() AS now');
    res.json({ message: 'EduCal backend is running...', time: rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
