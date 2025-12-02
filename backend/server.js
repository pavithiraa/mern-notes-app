import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
dotenv.config();

const Port = process.env.PORT || 5000;
const app = express();

app.get("/", (req, res) => {
  res.send("hello world");
});

connectDB();

app.listen(Port, () => {
  console.log(`server connected successfully on port ${Port}`);
});
