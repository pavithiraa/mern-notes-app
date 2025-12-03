import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/create", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const note = await Note.create({ title, description });
    res.status(201).json({ success: true, note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error:" });
  }
});

export default router;
