import mongoose from "mongoose";

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  para: String,
  price: { type: Number, required: true },
  category: { type: String, required: true },
  pic: String,
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerName: String,
  sellerEmail: String,
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Book = mongoose.model("Book", BookSchema);

export default Book;