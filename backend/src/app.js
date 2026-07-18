const express = require("express");
const path = require("path");
const db = require("./config/db");

const buildingRoutes = require("./routes/buildingRoutes"); // Thêm dòng này
const apartmentRoutes = require("./routes/apartmentRoutes");

const app = express();

app.use(express.json());

app.use("/upload", express.static(path.join(__dirname, "upload")));

// Đăng ký routes
app.use("/api/buildings", buildingRoutes);
app.use("/api/apartments", apartmentRoutes);

app.get("/", (req, res) => {
    res.send("Backend quản lý tòa nhà đang chạy kkk");
});

app.listen(3000, () => {
    console.log("Server đang chạy tại http://localhost:3000");
});