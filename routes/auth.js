const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "User already exists. Please Login." });

    //generate hash password
    const salt = await bcrypt.genSalt(10); // add salt with default setting(documentation)
    const hashedPassword = await bcrypt.hash(password, salt); // make hash

    const user = new User({ username: username, password: hashedPassword });
    await user.save();

    // generate limited time login token for user
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "4h" });
    res.status(201).json({ message: "User registered successfully", token, username });
  } catch (error) {
    res.status(500).json({ message: "Server error while registeration", error: error });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found!" });

    //? comparePassword -> model/User
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) return res.status(400).json({ message: "Invalid password!" });

    res.status(200).json({ message: "Login successfull", username: user.username });
  } catch (error) {
    res.status(500).json({ message: "Server error while login", error: error });
  }
});

module.exports = router;
