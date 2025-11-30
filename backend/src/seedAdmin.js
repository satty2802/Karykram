import dotenv from 'dotenv';
import connectDB from './config/db.js';
import User from './models/user.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await connectDB();
    const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@gbu.edu';
    const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123';

    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('Admin user already exists:', adminEmail);
      process.exit(0);
    }

    const admin = await User.create({
      name: 'Site Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('Admin created:', admin.email);
    process.exit(0);
  } catch (err) {
    console.error('Failed to create admin:', err);
    process.exit(1);
  }
};

createAdmin();
