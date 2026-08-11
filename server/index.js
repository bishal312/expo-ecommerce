// https://expo-ecommerce-kappa.vercel.app/
import express from "express";
import dotenv from "dotenv";
import connectDb from "./utils/db.js";
import cloudinary from "cloudinary";
import cors from "cors";
//https://expo-ecommerce-kappa.vercel.app/
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const app = express();

app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    await connectDb();
    next();
  } catch (error) {
    res.status(500).json({ message: "Database connection failed", error: error.message });
  }
});

// importing routes
import userRoutes from "./routes/user.js";
import productRoutes from "./routes/product.js";
import cartRoutes from "./routes/cart.js";
import addressRoutes from "./routes/address.js";
import orderRoutes from "./routes/order.js";

// using routes
app.use("/api", userRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);

app.get("/", (req, res) => {
  res.send("API is running on Vercel!");
});

if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
}

export default app;