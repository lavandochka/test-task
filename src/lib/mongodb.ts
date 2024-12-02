// lib/mongodb.ts
import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://julia:12345@cluster0.zspxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connect() {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  return mongoose.connect(MONGO_URI);
}

export default connect;
