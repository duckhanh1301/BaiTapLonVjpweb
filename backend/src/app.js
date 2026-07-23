const express = require("express");
const cors = require("cors");
const path = require("path");

// Import routes
const authRoutes = require("./routes/authRoutes");
const buildingRoutes = require("./routes/buildingRoutes");
const apartmentRoutes = require("./routes/apartmentRoutes");
const tenantRoutes = require("./routes/tenantRoutes");
const contractRoutes = require("./routes/contractRoutes");
const exportRoutes = require("./routes/exportRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const imageRoutes = require("./routes/imageRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Static folder
app.use("/upload", express.static(path.join(__dirname, "upload")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/buildings", buildingRoutes);
app.use("/api/apartments", apartmentRoutes);
app.use("/api/tenants", tenantRoutes);
app.use("/api/contracts", contractRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/images", imageRoutes);
// Test API
app.get("/", (req, res) => {
    res.send("Backend quản lý tòa nhà đang chạy");
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});