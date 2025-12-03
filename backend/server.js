import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
dotenv.config();

const Port = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use("/api/user", authRoutes);

connectDB();

app.listen(Port, () => {
  console.log(`server connected successfully on port ${Port}`);
});
