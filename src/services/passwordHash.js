import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error while hashing password");
  }
};

export const checkPassword = async (password, hashedPassword) => {
  try {
    const isCorrect = bcrypt.compare(password, hashedPassword);
    return isCorrect;
  } catch (error) {}
};
