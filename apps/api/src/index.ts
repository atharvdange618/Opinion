import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import { setupSocket } from "./socket/index.js";
import { setIO } from "./lib/io.js";
import { errorHandler } from "./middleware/errorHandler.js";
import oidcRoutes from "./routes/oidc.js";
import authRoutes from "./routes/auth.js";
import pollRoutes from "./routes/polls.js";
import publicRoutes from "./routes/public.js";

const app = express();
const httpServer = createServer(app);
const io = setupSocket(httpServer);
setIO(io);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(helmet());
app.use(hpp());
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", oidcRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/polls/public", publicRoutes);
app.use("/api/polls", pollRoutes);

app.use(errorHandler);

const PORT = parseInt(process.env.PORT || "3001", 10);
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/opinion";

async function start() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }

  httpServer.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

start();

export { io };
