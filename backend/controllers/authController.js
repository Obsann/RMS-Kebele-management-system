const express = require("express");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/authmodel.js");

const register = async (req, res) => {
  try {
    const { role,username, email, password, phone } = req.body;

    if (!role || !username || !email || !password ||!phone) {
      if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Bad Request", message: "Missing required fields" });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Conflict", message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      role,
      username,
      email,
      password: hashedPassword,
      phone
    });

    res.status(201).json({
      message: "Registration submitted successfully. Awaiting admin approval",
      status: user.status
    });
  } catch (err) {
    console.error("Register error:", err);
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};


// Login (unchanged)
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Unauthorized", message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};

// Check user
const checkUser = async (req, res) => {
  try {
    // allow checking by route param `:id` or by authenticated user `req.user.id`
    const { id } = req.params;
    const userId = id || (req.user && req.user.id);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized", message: "Missing authentication or user id" });
    }

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "Not Found", message: "User not found" });
    }

    res.json({ message: "Valid user", role: user.role, userId: user._id, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Server Error", message: err.message });
  }
};

module.exports = { register, login, checkUser };