const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let dbUrl = process.env.MONGODB_URI;

    // Check if MONGODB_URI is empty, default placeholder, or missing
    if (!dbUrl || dbUrl.includes('your_username') || dbUrl.includes('xxxxx') || dbUrl.trim() === '') {
      console.log('\n⚠️  Using placeholder/empty MONGODB_URI. Starting local In-Memory MongoDB Server for testing...');
      mongoServer = await MongoMemoryServer.create();
      dbUrl = mongoServer.getUri();
      console.log(`ℹ️  Local In-Memory MongoDB started at: ${dbUrl}`);
    }

    const conn = await mongoose.connect(dbUrl);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.log('ℹ️  Server will continue running, but DB-dependent features might fail.');
  }
};

module.exports = connectDB;

