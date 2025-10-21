import './config/hardcodedEnv.js';

import app from './app.js';
import logger from './utils/logger.js';
import { ensureInitialised } from './bootstrap.js';

const startServer = async () => {
  try {
    await ensureInitialised();
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
