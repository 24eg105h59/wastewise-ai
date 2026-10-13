import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Determine static public directory
const getPublicDir = () => {
  const candidates = [
    path.join(__dirname, '../public'),
    path.join(process.cwd(), 'public'),
    path.join(__dirname, 'public'),
    path.join(__dirname, '../../public')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return path.join(process.cwd(), 'public');
};

const publicDir = getPublicDir();

// Serve static assets from public directory
app.use(express.static(publicDir));

import { seedDemoData } from './utils/seedDatabase';

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'FoodGuard AI API' });
});

// Database connectivity check endpoint
app.get(['/api/db-check', '/db-check'], async (req, res) => {
  try {
    const hasDbUrl = !!process.env.DATABASE_URL;
    let userCount = 0;
    try {
      userCount = await prisma.user.count();
      if (userCount === 0) {
        await seedDemoData(prisma);
        userCount = await prisma.user.count();
      }
    } catch (dbErr: any) {
      return res.status(500).json({
        status: 'error',
        hasDatabaseUrl: hasDbUrl,
        message: dbErr?.message || 'Database query error',
        code: dbErr?.code
      });
    }

    res.json({
      status: 'connected',
      hasDatabaseUrl: hasDbUrl,
      hasGeminiKey: !!(process.env.GEMINI_API_KEY),
      aiProvider: 'Google Gemini',
      userCount,
      adminEmail: 'admin@hdbakers.com',
      adminPassword: 'demo123'
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'error',
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      message: err?.message || 'Database error',
      code: err?.code
    });
  }
});

// Explicit seed trigger endpoint
app.all(['/api/seed', '/seed'], async (req, res) => {
  try {
    const result = await seedDemoData(prisma);
    res.json({
      status: 'seed_complete',
      result,
      adminEmail: 'admin@hdbakers.com',
      adminPassword: 'demo123'
    });
  } catch (err: any) {
    res.status(500).json({
      status: 'seed_error',
      message: err?.message
    });
  }
});

import authRoutes from './routes/authRoutes';
import scanRoutes from './routes/scanRoutes';
import productRoutes from './routes/productRoutes';
import taskRoutes from './routes/taskRoutes';

// Mount API routes under both /api/* and root prefix (for Vercel dynamic route compatibility)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/scans', '/scans'], scanRoutes);
app.use(['/api/products', '/products'], productRoutes);
app.use(['/api/tasks', '/tasks'], taskRoutes);

// For all other routes, serve React frontend index.html for client-side routing
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: `Endpoint ${req.method} ${req.path} not found` });
  }
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.json({
      status: 'ok',
      service: 'WasteWise AI API',
      message: 'API is running. Access endpoints under /api/*'
    });
  }
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
