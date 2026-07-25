const express = require("express");

const router = express.Router();

const buildingController = require("../controllers/buildingController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// Lấy tất cả tòa nhà
router.get("/", authMiddleware, authorizeRoles("Admin"), buildingController.getAllBuildings);

// Tìm kiếm (phải đặt trước :id)
router.get("/search", authMiddleware, authorizeRoles("Admin"), buildingController.searchBuildings);

// Lấy tòa nhà theo ID
router.get("/:id", authMiddleware, authorizeRoles("Admin"), buildingController.getBuildingById);

// Thêm
router.post("/", buildingController.createBuilding);

// Sửa
router.put("/:id", buildingController.updateBuilding);

// Xóa
router.delete("/:id", buildingController.deleteBuilding);

module.exports = router;