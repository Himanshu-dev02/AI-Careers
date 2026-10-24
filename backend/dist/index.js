import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.js";
import aiRoutes from "./routes/ai.js";
import paymentRoutes from "./routes/payment.js";
import cors from "cors";
import Razorpay from "razorpay";
const url = `https://ai-careers-l0gi.onrender.com`;
const interval = 30000;
dotenv.config();
connectDB().then(() => console.log("DB connected"));
export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use("/api/user", userRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/payment", paymentRoutes);
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
