import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'),
});

import app from './app.js';
import connectDatabase from './config/db.js';
import config, { validateRuntimeConfig } from './config/index.js';
import { createServer } from 'node:http';
import attachSocketServer from './socket/index.js';

const startServer = async () => {
  try {
    validateRuntimeConfig();
    await connectDatabase();

    const PORT = config.port;

    const httpServer = createServer(app);
    attachSocketServer(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();
