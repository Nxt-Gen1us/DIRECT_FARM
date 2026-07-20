import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({
  path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../.env'),
});

import app from './app.js';
import connectDatabase from './config/db.js';
import config from './config/index.js';

const startServer = async () => {
  try {
    await connectDatabase();

    const PORT = config.port;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startServer();