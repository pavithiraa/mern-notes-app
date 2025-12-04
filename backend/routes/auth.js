import express from "express";

import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";

const router = express.Router();

//register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ username, email, password });
    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user?.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error:" });
  }
});

//login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchpassword(password))) {
      return res.status(400).json({ message: "Invalid Crendentials" });
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user?.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//me
router.get("/me", protect, async (req, res) => {
  res.status(200).json(req.user);
});

//generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
export default router;
