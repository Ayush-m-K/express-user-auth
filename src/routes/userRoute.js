import { Router } from "express";
import {
  loginValidationSchema,
  signupValidationSchema,
} from "../middleware/userValidator.js";
import {
  authenticatToken,
  login,
  signup,
} from "../controller/userController.js";

const router = Router();

router.get("/", (req, res) => {
  return res.send({ msg: "welcome" });
});

router.post("/signup", signupValidationSchema, signup);
router.post("/login", loginValidationSchema, login);
router.post("/auth", authenticatToken);

export default router;
