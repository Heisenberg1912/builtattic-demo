// server/src/index.js
import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import client from 'prom-client';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { attachUser } from './auth/middleware.js';

// Routers (these should exist in ./routes)
import healthRouter from './routes/health.js';
import authRouter from './routes/auth.js';
import firmsRouter from './routes/firms.js';
import productsRouter from './routes/products.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import adminRouter from './routes/admin.js';
import paymentsRouter from './routes/payments.js';
import marketplaceRouter from './routes/marketplace.js';
import uploadRouter from './routes/upload.js';
import assetsRouter from './routes/assets.js';
import vitruviRouter from './routes/vitruvi.js';

const app = express();

/* ---------- Core middleware ---------- */
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
const rawCorsOrigins = (process.env.CORS_ORIGIN || '*')
  .split(',')
  .map((item) => item.trim())
  .filter(Boolean);
const corsOrigin =
  rawCorsOrigins.length === 0 || rawCorsOrigins.includes('*') ? '*' : rawCorsOrigins;

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(attachUser);

/* ---------- Mongo connect ---------- */
(async function connectDB() {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DBNAME || 'builtattic_dev';
  if (!uri) {
    console.error('❌ MONGO_URI missing in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, { dbName });
    console.log(`Mongo connected: ${dbName}`);
  } catch (err) {
    console.error('❌ Mongo error:', err.message);
    process.exit(1);
  }
})();

/* ---------- Routers (mounted at / and /api) ---------- */
app.use(['/health', '/api/health'], healthRouter);
app.use(['/auth', '/api/auth'], authRouter);
app.use(['/', '/api'], firmsRouter);       // /vendor/apply
app.use(['/', '/api'], productsRouter);    // /catalog, /firms/:id/products
app.use(['/', '/api'], cartRouter);        // /cart
app.use(['/', '/api'], ordersRouter);      // /orders
app.use(['/', '/api'], adminRouter);       // /admin/*
app.use(['/payments', '/api/payments'], paymentsRouter);
app.use(['/marketplace', '/api/marketplace'], marketplaceRouter);
app.use(['/uploads', '/api/uploads'], uploadRouter);
app.use(['/assets', '/api/assets'], assetsRouter);
app.use(['/vitruvi', '/api/vitruvi'], vitruviRouter);

/* ---------- Fallback health (works even if router changes) ---------- */
app.get(['/health', '/api/health'], (_req, res) => {
  res.json({ ok: true });
});

app.get(['/health/db', '/api/health/db'], async (_req, res) => {
  try {
    const connected = mongoose.connection.readyState === 1; // 1 = connected
    if (connected && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }
    res.json({ ok: true, mongo: connected });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

/* ---------- Swagger (docs at /docs and /api/docs) ---------- */
const swaggerSpec = swaggerJSDoc({
  definition: { openapi: '3.0.0', info: { title: 'Builtattic API', version: '1.0.0' } },
  apis: ['./src/routes/**/*.js', './src/models/**/*.js'],
});
app.use(['/docs', '/api/docs'], swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/* ---------- Metrics (Prometheus) ---------- */
client.collectDefaultMetrics();
app.get(['/metrics', '/api/metrics'], async (_req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

/* ---------- Root (helpful if someone hits /) ---------- */
app.get('/', (_req, res) => res.json({ ok: true }));

/* ---------- Start server ---------- */
const PORT = Number(process.env.PORT || 4000);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
