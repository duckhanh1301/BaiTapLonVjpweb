const express = require("express");
const cors = require("cors");
const path = require("path");

const db = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
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
    res.send("Backend quản lý tòa nhà đang chạy");
});

// Port
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});