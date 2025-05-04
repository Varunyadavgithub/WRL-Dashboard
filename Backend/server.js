import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/connectDB.js";

const app = express();
dotenv.config();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

// APIs
app.use("/api/v1/auth", authRoutes);

app.get("/", (req, res) => {
  return res.status(200).json({
    message: "Hello from server",
    success: true,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port: ${PORT}`);
});
