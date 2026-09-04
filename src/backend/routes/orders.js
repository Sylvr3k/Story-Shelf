import express from 'express';
const router = express.Router();

import Order from "../models/Orders.js";
import Book from "../models/Book.js";




router.post("/checkout", async (req, res) => {
  try {
    const { cartItems, buyerId, buyerEmail, buyerName } = req.body;

    if (!cartItems?.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orders = [];

    for (let item of cartItems) {
      const book = await Book.findById(item._id);
      if (!book) continue;

      const order = await Order.create({
        bookId: book._id,
        title: book.title,
        price: book.price,

        buyerId,
        buyerEmail,
        buyerName,

        sellerId: book.sellerId,
        sellerEmail: book.sellerEmail,
        sellerName: book.sellerName,

        status: "PENDING",
        createdAt: new Date(),
      });

      orders.push(order);
    }

    // return FIRST order id for linking (simple version)
    res.json({
      orderId: orders[0]?._id,
      message: "Order created",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Checkout failed" });
  }
});


// GET /api/orders/sales/:sellerId
// routes/orders.js

router.get("/sales/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;

    if (!sellerId) {
      return res.status(400).json({ error: "Seller ID required" });
    }

    const sales = await Order.find({ sellerId }).sort({ purchasedAt: -1 });

    res.json(Array.isArray(sales) ? sales : []);
  } catch (err) {
    console.error("Sales fetch error:", err);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

router.post("/stkpush", async (req, res) => {
  try {
    const { phone, amount, orderId } = req.body;

    const shortcode = process.env.MPESA_SHORTCODE;
    const passkey = process.env.MPESA_PASSKEY;

    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);

    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString("base64");

    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString("base64");

    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } }
    );

    const tokenData = await tokenRes.json();

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenData.access_token}`,
        },
        body: JSON.stringify({
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phone,
          PartyB: shortcode,
          PhoneNumber: phone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: orderId,
          TransactionDesc: "Purchase",
        }),
      }
    );

    const data = await stkRes.json();

    console.log("STK RESPONSE:", data);

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "STK failed" });
  }
});

// GET /api/orders/sales/:buyerId
// routes/orders.js

router.get("/purchases/:buyerId", async (req, res) => {
  try {
    const { buyerId } = req.params;

    if (!buyerId) {
      return res.status(400).json({ error: "Buyer ID required" });
    }

    const purchases = await Order.find({
      buyerId,
      status: "PAID"
    }).sort({ purchasedAt: -1 });

    res.json(Array.isArray(purchases) ? purchases : []);
  } catch (err) {
    console.error("Purchases fetch error:", err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

export default router;