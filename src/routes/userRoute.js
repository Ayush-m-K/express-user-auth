import { Router } from "express";
import {
  loginValidationSchema,
  passwordValidation,
  signupValidationSchema,
} from "../middleware/userValidator.js";
import {
  authenticatToken,
  resetPassword,
  login,
  signup,
  deleteUser,
} from "../controller/userController.js";

const router = Router();

router.get("/", (req, res) => {
  return res.send({ msg: "welcome" });
});

router.post("/signup", signupValidationSchema, signup);
router.post("/login", loginValidationSchema, login);
router.delete("/login", deleteUser);
router.put(
  "/reset-password",
  authenticatToken,
  passwordValidation,
  resetPassword
);
export default router;
