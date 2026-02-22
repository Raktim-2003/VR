import express from "express";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.routes.js";

dotenv.config();

const app = express();

// ✅ Allowed origins (local + netlify)
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://smartassi-ai.netlify.app",
];

// ✅ CORS Fix
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (mobile apps, postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  }),
);

const port = process.env.PORT || 8000;

app.use(express.json());
app.use(cookieParser());

// routes
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

// start server
app.listen(port, () => {
  connectDb();

  console.log(`Server running on port ${port}`);
});
