import express from "express";
import session from "express-session";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/apiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import multer from "multer"
import fs from "fs"

// Load environment variables
dotenv.config();

// Define __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// ==========================================
// 1. Core Middleware
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Configure Express Session (required for admin authentication)
app.use(
  session({
    secret: process.env.SESSION_SECRET || "super_secret_portfolio_key_change_me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS in production
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day session duration
    },
  })
);

app.use("/api", apiRoutes);
app.use("/api/admin", adminRoutes);

// ==========================================
// 2. Static Frontend Serving
// ==========================================
// Serve public files (HTML, CSS, JS) from the public directory
app.use(express.static(path.join(__dirname, "public")));




// ==========================================
// 3. Routes Placeholders 
// ==========================================
// (We will hook up apiRoutes.js, adminRoutes.js, and viewRoutes.js as we build them)
// app.use("/api", apiRoutes);
// app.use("/admin", adminRoutes);

// Fallback route to serve index.html for root requests
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ==========================================
// 4. Global Error Handling Middleware Placeholder
// ==========================================
// (We will import middleware/errorHandler.js here later)
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// ==========================================
// 5. Start Server
// ==========================================
// app.listen(PORT, () => {
//   console.log(`Server is running live on port ${PORT}`);
// });

export default app;