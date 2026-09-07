import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import multer from "multer";
import Order from "./models/Orders.js";
import booksRoutes from "./routes/books.js";
import ordersRoutes from "./routes/orders.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 5009;

// CORS setup
app.use(
  cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(bodyParser.json());
app.use("/books", booksRoutes);
app.use("/orders", ordersRoutes);

const dbURI = "mongodb://127.0.0.1:27017/SaleSphere";

mongoose
  .connect(dbURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

// Schema
const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  gender: { type: String, required: true },
  date: { type: Date, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },

  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

const User = mongoose.model("User", userSchema);

// Register user
app.post("/user", async (req, res) => {
  try {
    const { email, phone, username, password, ...rest } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "The Email you've entered is already in use." });
    }

    const existingUserOne = await User.findOne({ phone });
    if (existingUserOne) {
      return res
        .status(409)
        .json({ error: "The Phone number you've entered is already in use." });
    }

    const existingUserTwo = await User.findOne({ username });
    if (existingUserTwo) {
      return res
        .status(409)
        .json({ error: "The User Name you've entered is already in use." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      ...rest,
      email,
      phone,
      username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error saving user:", err);
    res.status(500).json({ error: "Failed to register user." });
  }
});

// Login user
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ALL NEEDED DATA IN TOKEN
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.firstname,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        email: user.email,
        name: user.firstname,
      },
    });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "If user exists, link sent" });

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = token;
  user.resetTokenExpiry = Date.now() + 3600000; // 1 hour

  await user.save();

  const resetLink = `http://localhost:3001/reset-password/${token}`;

  res.json({
    message: "Reset link generated",
    resetLink, // for now we just return it
  });
});

app.post("/reset-password/:token", async (req, res) => {
  const user = await User.findOne({
    resetToken: req.params.token,
    resetTokenExpiry: { $gt: Date.now() },
  });

  console.log("Incoming token:", req.params.token);

  if (!user) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }

  user.password = await bcrypt.hash(req.body.password, 10);

  user.resetToken = null;
  user.resetTokenExpiry = null;

  await user.save();

  res.json({ message: "Password updated" });

  console.log("User found:", user);
});

app.post("/callback", async (req, res) => {
  try {
    console.log("FULL CALLBACK:", JSON.stringify(req.body, null, 2));

    const result = req.body?.Body?.stkCallback;

    if (!result) {
      console.log("No stkCallback found");
      return res.sendStatus(200);
    }

    console.log("MPESA CALLBACK:", result);

    const checkoutRequestId = result.CheckoutRequestID;
    const orders = await Order.find({ checkoutRequestId });

    if (!orders.length) {
      console.log("No orders found for CheckoutRequestID:", checkoutRequestId);
      return res.sendStatus(200);
    }

    // PAYMENT SUCCESS
    if (result.ResultCode === 0) {
      console.log("PAYMENT SUCCESSFUL");

      const items = result.CallbackMetadata?.Item || [];

      const receipt = items.find((i) => i.Name === "MpesaReceiptNumber")?.Value;

      for (const order of orders) {
        order.status = "PAID";
        order.mpesaReceipt = receipt;
        order.paidAt = new Date();
        await order.save();

        await Book.findByIdAndDelete(order.bookId);
      }

      console.log("BOOKS REMOVED FROM STORE, ORDERS UPDATED TO PAID");
    } else {
      console.log(
        "PAYMENT FAILED. ResultCode:",
        result.ResultCode,
        result.ResultDesc,
      );

      for (const order of orders) {
        order.status = "FAILED";
        await order.save();
      }

      console.log("ORDERS UPDATED TO FAILED");
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("CALLBACK ERROR:", err);
    res.sendStatus(200);
  }
});

// Multer setup
const upload = multer({ storage: multer.memoryStorage() });

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token" });
    }
    req.userId = decoded._id;
    next();
  });
};

// Get user profile
app.get("/user/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
app.put(
  "/user/profile",
  verifyToken,
  upload.single("profilePicture"),
  async (req, res) => {
    const { firstname, lastname, gender, date, address } = req.body;
    const profilePicture = req.file
      ? req.file.buffer.toString("base64")
      : undefined;

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        {
          firstname,
          lastname,
          gender,
          date,
          address,
          ...(profilePicture && { profilePicture }),
        },
        { new: true },
      ).select("-password");

      if (updatedUser) {
        res
          .status(200)
          .json({ message: "Profile updated successfully", user: updatedUser });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      res.status(500).json({ error: "Server error" });
    }
  },
);

mongoose.connection.once("open", () => {
  console.log("Mongoose connection open");
  app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
  });
});
