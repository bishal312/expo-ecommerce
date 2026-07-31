import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "expo-ecommerce",
    });

    console.log("Mongo Db connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;
