import mongoose from "mongoose";

const connectDb = async () => {
  // Check if mongoose is already connected (1 = connected, 2 = connecting)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    if (!process.env.MONGO_URL) {
      throw new Error("MONGO_URL is not defined in environment variables");
    }

    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "expo-ecommerce",
    });

    console.log(`MongoDB Connected: ${db.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    throw error;
  }
};

export default connectDb;