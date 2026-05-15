import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoose from 'mongoose';
import { createServer } from 'node:http';

import { setIO } from './lib/io.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.js';
import oidcRoutes from './routes/oidc.js';
import pollRoutes from './routes/polls.js';
import publicRoutes from './routes/public.js';
import { setupSocket } from './socket/index.js';

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);
setIO(io);

app.use(
  cors({
    credentials: true,
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  }),
);
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', oidcRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/polls/public', publicRoutes);
app.use('/api/polls', pollRoutes);

app.use(errorHandler);

const PORT = Number.parseInt(process.env.PORT || '3001', 10);
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/opinion';

try {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');
} catch (error) {
  console.error('MongoDB connection error:', error);
  throw error;
}

httpServer.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});

export { io };
