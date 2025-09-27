import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./src/routes/userRoute.js";
import mongoose from "mongoose";

dotenv.config();
const PORT = process.env.PORT || 8080;
const MONGODB_URL = process.env.MONGODBURL;

mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to Database"))
  .catch((err) => console.error("Error connecting to Database: ", err.message));

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/user", userRouter);
app.listen(PORT, () => {
  console.log(`⚡ Server running at port ${PORT}`);
});

