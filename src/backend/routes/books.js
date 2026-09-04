// routes/books.js
import express from 'express';
const router = express.Router();
import Book from "../models/Book.js";

// Add book
router.post("/", async (req, res) => {
  try {
    const book = new Book(req.body);
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all books
router.get("/", async (req, res) => {
  try {
    const books = await Book.find().populate("sellerId", "firstname");
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get books for a specific seller
router.get("/seller/:sellerId", async (req, res) => {
  try {
    console.log("SellerId param:", req.params.sellerId); // 🔍
    const books = await Book.find({ sellerId: req.params.sellerId }).populate("sellerId", "firstname");
    console.log("Books found:", books); // 🔍
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delets A book from the inventory
router.delete("/:id", async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;