import './config/hardcodedEnv.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import client from 'prom-client';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

import { attachUser } from './auth/middleware.js';
import { loadSecrets } from './config/secrets.js';
import logger, { requestLogger } from './utils/logger.js';

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
import mattersRouter from './routes/matters.js';
import supportRouter from './routes/support.js';
import documentsRouter from './routes/documents.js';
import accessRequestsRouter from './routes/accessRequests.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('trust proxy', 1);

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

app.use(requestLogger);
app.use(rateLimit({ windowMs: 60_000, max: 120 }));
app.use(attachUser);

/* ---------- Routers (mounted at / and /api) ---------- */
app.use(['/health', '/api/health'], healthRouter);
app.use(['/auth', '/api/auth'], authRouter);
app.use(['/', '/api'], firmsRouter); // /vendor/apply
app.use(['/', '/api'], productsRouter); // /catalog, /firms/:id/products
app.use(['/', '/api'], cartRouter); // /cart
app.use(['/', '/api'], ordersRouter); // /orders
app.use(['/', '/api'], adminRouter); // /admin/*
app.use(['/payments', '/api/payments'], paymentsRouter);
app.use(['/marketplace', '/api/marketplace'], marketplaceRouter);
app.use(['/uploads', '/api/uploads'], uploadRouter);
app.use(['/assets', '/api/assets'], assetsRouter);
app.use(['/vitruvi', '/api/vitruvi'], vitruviRouter);
app.use(['/matters', '/api/matters'], mattersRouter);
app.use(['/support', '/api/support'], supportRouter);
app.use(['/documents', '/api/documents'], documentsRouter);
app.use(['/access-requests', '/api/access-requests'], accessRequestsRouter);

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
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
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

const shouldServeStatic =
  process.env.SERVE_CLIENT_FROM_API?.toLowerCase() !== 'false';

const registerStaticAssets = () => {
  if (!shouldServeStatic) {
    return false;
  }

  const configuredPath = process.env.CLIENT_BUILD_PATH;
  const defaultPath = path.resolve(__dirname, '../../client/dist');
  const buildPath = path.resolve(process.cwd(), configuredPath || defaultPath);
  const indexHtml = path.join(buildPath, 'index.html');

  if (!fs.existsSync(indexHtml)) {
    logger.warn('Client build not found; skipping static asset registration', {
      buildPath,
    });
    return false;
  }

  app.use(
    express.static(buildPath, {
      index: false,
      maxAge: '1h',
    })
  );

  app.get('*', (req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/metrics') ||
      req.path.startsWith('/docs')
    ) {
      return next();
    }
    res.sendFile(indexHtml);
  });

  logger.info('Serving client build assets', { buildPath });
  return true;
};

const staticRegistered = registerStaticAssets();

if (!staticRegistered) {
  app.get('/', (_req, res) => res.json({ ok: true }));
}

app.use((error, req, res, next) => {
  logger.error('Unhandled application error', {
    error: error.message,
    stack: error.stack,
    path: req.path,
  });
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.statusCode || 500).json({ error: 'internal_error' });
});

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  const dbName = process.env.MONGO_DBNAME || 'builtattic_dev';

  if (!uri) {
    throw new Error('MONGO_URI missing in configuration');
  }

  await mongoose.connect(uri, { dbName });
  logger.info('Mongo connected', { dbName });
};

const startServer = async () => {
  try {
    await loadSecrets();
    await connectDB();
  } catch (error) {
    logger.error('Failed to initialise application', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }

  const PORT = Number(process.env.PORT || 4000);
  const KEEP_ALIVE_TIMEOUT_MS = Number(
    process.env.KEEP_ALIVE_TIMEOUT_MS || 620_000
  );

  const server = app.listen(PORT, () => {
    logger.info('Server running', {
      port: PORT,
      env: process.env.NODE_ENV,
    });
  });

  server.keepAliveTimeout = KEEP_ALIVE_TIMEOUT_MS;
  server.headersTimeout = KEEP_ALIVE_TIMEOUT_MS + 5_000;
};

startServer();

export default app;
