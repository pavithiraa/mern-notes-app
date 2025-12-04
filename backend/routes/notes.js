import express from "express";
import Note from "../models/Note.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

//get notes
router.get("/", protect, async (req, res) => {
  try {
    const notes = await Note.find({ createdBy: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log("Get all notes error:", err);
    res.status(500).json({ message: "Server error" });
  }
});
//create note
router.post("/", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    if (!title || !description) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    const note = await Note.create({
      title,
      description,
      createdBy: req.user._id,
    });
    res.status(201).json({ success: true, note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//get a single note
router.get("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ message: "Notes not found." });
    }
    res.status(200).json({ success: true, note });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//update note
router.put("/:id", protect, async (req, res) => {
  const { title, description } = req.body;
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ message: "Notes not found." });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    note.title = title || note.title;
    note.description = description || note.description;

    const updatedCode = await note.save();
    res.json(updatedCode);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

//delte
router.delete("/:id", protect, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(400).json({ message: "Notes not found." });
    }
    if (note.createdBy.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized." });
    }

    await note.deleteOne();
    res.json({ message: "Note was deleted" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
