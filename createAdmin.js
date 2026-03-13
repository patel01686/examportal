const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // New admin credentials
    const email = 'mahi07@gmail.com';
    const password = 'mahi9955@';

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Use raw collection insert to bypass mongoose middleware
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    // Delete existing admin with the same email if any
    await usersCollection.deleteOne({ email });

    // Insert new admin
    await usersCollection.insertOne({
      name: 'Admin',
      email: email,
      password: hashedPassword,
      role: 'admin'
    });

    console.log('✅ Admin user created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    mongoose.disconnect();
  }
}

createAdmin();