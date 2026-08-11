import mongoose from "mongoose";

let isConnected = false;

const connectDb = async () => {

  if (isConnected) {
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "expo-ecommerce",
    });

    isConnected = db.connection[0].readyState === 1;
    console.log("Mongo Db connected");
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default connectDb;
