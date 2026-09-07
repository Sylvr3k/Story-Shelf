import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },

  title: String,
  price: Number,

  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  buyerEmail: String,
  buyerName: String,

  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sellerEmail: String,
  sellerName: String,

  purchasedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "PENDING",
  },
  phone: String,
  checkoutRequestId: {
    type: String,
    index: true,
  },
  mpesaReceipt: String,
  paidAt: Date,
});

// CREATE MODEL
const Order = mongoose.model("Order", OrderSchema);

// EXPORT MODEL
export default Order;
