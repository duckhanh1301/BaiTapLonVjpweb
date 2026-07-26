const express = require("express");

const router = express.Router();

const buildingController = require("../controllers/buildingController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("ChuThue"));

// Lấy tất cả tòa nhà
router.get("/", buildingController.getAllBuildings);

// Tìm kiếm (phải đặt trước :id)
router.get("/search", buildingController.searchBuildings);

// Lấy tòa nhà theo ID
router.get("/:id", buildingController.getBuildingById);

// Thêm
router.post("/", buildingController.createBuilding);

// Sửa
router.put("/:id", buildingController.updateBuilding);

// Xóa
router.delete("/:id", buildingController.deleteBuilding);

module.exports = router;
