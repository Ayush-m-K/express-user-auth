import User from "../model/userModel.js";
import { validationResult } from "express-validator";
import { checkPassword, hashPassword } from "../services/passwordHash.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  try {
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });
    const { password: _, ...userData } = currentUser.toObject();
    return res.status(200).json({ user: userData });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      if (existingUser.username === username)
        return res.status(400).json({ message: "Username already exists" });
      if (existingUser.email === email)
        return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    const { password: _, ...userData } = savedUser.toObject();
    return res.status(201).json({ message: "Signup successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });
  const { username, password } = req.body;
  try {
    const existUser = await User.findOne({ username: username });
    if (!existUser) return res.status(400).json({ message: "User not found" });
    const isMatch = await checkPassword(password, existUser.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect Password" });
    const payload = { id: existUser.id, username: existUser.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return res
      .status(200)
      .json({ message: "Login successfull", token: accessToken });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: errors.array() });
  try {
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser)
      return res.status(404).json({ message: "User not found" });
    const { oldPassword, newPassword } = req.body;
    const isMatch = await checkPassword(oldPassword, currentUser.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password does not match" });
    if (oldPassword === newPassword)
      return res
        .status(400)
        .json({ message: "New password cannot be same as old password" });
    currentUser.password = await hashPassword(newPassword);
    await currentUser.save();
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  if (!req.user)
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  try {
    const deletedUser = await User.findOneAndDelete({
      username: req.user.username,
    });
    if (!deletedUser)
      return res.status(404).json({ message: "User not found" });
    return res.status(200).json({ message: "Delete successfull" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
