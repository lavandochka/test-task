import mongoose from 'mongoose';

const MONGO_URI = 'mongodb+srv://julia:12345@cluster0.zspxo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

async function connect() {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected.");
    return mongoose.connection;
  }

  try {
    console.log("Connecting to MongoDB...");
    // Подключение без использования старых параметров
    return await mongoose.connect(MONGO_URI);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
}

export default connect;
