import User from "../model/userModel.js";
import { validationResult } from "express-validator";
import { checkPassword, hashPassword } from "../services/passwordHash.js";
import jwt from "jsonwebtoken";

export const getUser = async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.user?.username });
    if (!currentUser)
      return res.status(404).json({ msg: "Invalid token or user not found" });
    const { password: _, ...userData } = currentUser.toObject();
    return res.status(201).json({ user: userData });
  } catch (error) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

export const signup = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { username, email, password } = req.body;
  try {
    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      if (existUser.username === username)
        return res.status(400).json({ errMsg: "Username already exists" });
      if (existUser.email === email)
        return res.status(400).json({ errMsg: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const savedUser = await newUser.save();
    const { password: _, ...userData } = savedUser.toObject();
    return res.status(201).json({ user: userData });
  } catch (error) {
    return res
      .status(500)
      .json({ errMsg: "Signup failed", error: error.message });
  }
};

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { username, password } = req.body;
  try {
    const existUser = await User.findOne({ username: username });
    if (!existUser) return res.status(400).json({ msg: "User not found" });
    const isMatch = await checkPassword(password, existUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Incorrect Password" });
    const payload = { id: existUser.id, username: existUser.username };
    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET);
    return res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    return res.status(500).json({ errMsg: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errMsg: errors.array() });
  try {
    const currentUser = await User.findOne({ username: req.user?.username });
    if (!currentUser) return res.status(404).json({ msg: "Invalid token" });
    const { oldPassword, newPassword } = req.body;
    const isMatch = await checkPassword(oldPassword, currentUser.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Old password does not match" });
    if (oldPassword === newPassword)
      return res
        .status(400)
        .json({ msg: "New password cannot be same as old password" });
    currentUser.password = await hashPassword(newPassword);
    await currentUser.save();
    return res.status(200).json({ msg: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ msg: "Error reseting password" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findOneAndDelete({
      username: req.user?.username,
    });
    if (!deletedUser)
      return res.status(404).json({ msg: "Invalid token or user not found" });
    return res.status(200).json({ msg: "Delete successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
