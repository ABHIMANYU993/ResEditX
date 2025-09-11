require("dotenv").config();
const axios = require("axios");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//SIGN-UP
exports.usersSignup = async (req, res) => {
  const {is_subscribed=false,email, password,credits=0 } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.SALTROUNDS)
    ); // FIX: `parseInt()`
    const newUser = new User({
      is_subscribed,
      email,
      password: hashedPassword,
      credits
    });

    await newUser.save();
    res.status(201).json({ message: `${email} registered successfully` });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

