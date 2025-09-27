import { checkSchema } from "express-validator";

export const signupValidationSchema = checkSchema({
  username: {
    isString: { errorMessage: "Invalid username" },
    notEmpty: { errorMessage: "Username is required" },
  },
  email: {
    isString: { errorMessage: "Invalid email" },
    notEmpty: { errorMessage: "Email is required" },
    isEmail: { errorMessage: "Please enter a valid email address" },
  },
  password: {
    isString: { errorMessage: "Invalid password" },
    notEmpty: { errorMessage: "password is required" },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be atleast 8 characters long",
    },
  },
});
export const loginValidationSchema = checkSchema({
  username: {
    isString: { errorMessage: "Invalid username" },
    notEmpty: { errorMessage: "Username is required" },
  },
  password: {
    isString: { errorMessage: "Invalid password" },
    notEmpty: { errorMessage: "password is required" },
    isLength: {
      options: { min: 8 },
      errorMessage: "Password must be atleast 8 characters long",
    },
  },
});
