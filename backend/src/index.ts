import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'FoodGuard AI API' });
});

import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import productRoutes from './routes/productRoutes';
import taskRoutes from './routes/taskRoutes';

app.use('/api/auth', authRoutes);
app.use('/api/scans', scanRoutes);
app.use('/api/products', productRoutes);
app.use('/api/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
