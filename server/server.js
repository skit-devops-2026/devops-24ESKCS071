import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
import githubRoutes from './routes/githubRoutes.js';
import authRoutes from './routes/authRoutes.js';
import agentRoutes from './routes/agentRoutes.js';

import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolios', portfolioRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/agent', agentRoutes);

// Root & Healthcheck
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    timestamp: new Date().toISOString(),
    services: {
      auth: 'active',
      githubIngestion: 'active',
      portfolioDatabase: 'active'
    }
  });
});

// 404 & Centralized Error Handlers
app.use(notFoundHandler);
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 CraftCV Server running on port ${PORT}`);
    console.log(`📡 Endpoints:`);
    console.log(`   - Auth: http://localhost:${PORT}/api/auth`);
    console.log(`   - Portfolios: http://localhost:${PORT}/api/portfolios`);
    console.log(`   - GitHub Ingest: http://localhost:${PORT}/api/github/:username`);
    console.log(`=========================================`);
  });
}

export default app;
export { app };
