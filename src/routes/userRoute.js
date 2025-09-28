import { Router } from "express";
import {
  loginValidationSchema,
  passwordValidation,
  signupValidationSchema,
} from "../middleware/userValidator.js";
import {
  resetPassword,
  login,
  signup,
  deleteUser,
  getUser,
} from "../controller/userController.js";

import { authenticatToken } from "../middleware/auth.js";

const router = Router();

router.get("/get", authenticatToken, getUser);
router.post("/signup", signupValidationSchema, signup);
router.post("/login", loginValidationSchema, login);
router.delete("/delete", authenticatToken, deleteUser);
router.put(
  "/reset-password",
  authenticatToken,
  passwordValidation,
  resetPassword
);
export default router;
