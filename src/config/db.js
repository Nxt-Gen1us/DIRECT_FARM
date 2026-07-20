import mongoose from 'mongoose';
import config from './index.js';

const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(config.mongoUri);

    const conn = await mongoose.connect(config.mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('========== FULL MONGODB ERROR ==========');
    console.error(error);
    console.error('========================================');

    process.exit(1);
  }
};

export default connectDatabase;