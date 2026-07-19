const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes"); // Thêm dòng này
const apartmentRoutes = require("./routes/apartmentRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder
app.use("/upload", express.static(path.join(__dirname, "upload")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/apartments", apartmentRoutes);

// Test API
app.get("/", (req, res) => {
    res.send("Backend quản lý tòa nhà đang chạy kkk");
});

app.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});