import { Router } from "express";
import User from "../model/userModel.js";
import { signupValidationSchema } from "../middleware/userValidator.js";
import { validationResult } from "express-validator";
import { hashPassword } from "../services/passwordHash.js";

const router = Router();

router.get("/", (req, res) => {
  return res.send({ msg: "welcome" });
});

router.post("/signup", signupValidationSchema, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() });
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({ username, email, password: hashedPassword });
    const existUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existUser) {
      if (existUser.username === username)
        return res.status(400).json({ errMsg: "Username already exists" });
      if (existUser.email === email)
        return res.status(400).json({ errMsg: "Email already exists" });
    }
    const savedUser = await newUser.save();
    const { password: _, ...userData } = savedUser.toObject();
    return res.status(201).json({ user: userData });
  } catch (err) {
    return res
      .status(500)
      .json({ errMsg: "Signup failed", error: err.message });
  }
});

export default router;
