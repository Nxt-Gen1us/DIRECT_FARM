import mongoose from 'mongoose';
import config from './index.js';

const connectDatabase = async () => {
  try {
    console.log('Connecting to MongoDB...');
    console.log(config.mongoUri);

    const conn = await mongoose.connect(config.mongoUri);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    const User = (await import('../models/user.model.js')).default;
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Database is empty. Auto-seeding initial DIRECT FARM dataset...');
      const { seedDatabase } = await import('../seed.js');
      await seedDatabase();
    }
  } catch (error) {
    console.error('========== FULL MONGODB ERROR ==========');
    console.error(error);
    console.error('========================================');

    process.exit(1);
  }
};

export default connectDatabase;