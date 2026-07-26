const express = require("express");

const router = express.Router();

const apartmentController = require("../controllers/apartmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

// GET endpoints - allow both ChuThue (Admin) and NguoiThue (users)
router.get("/", authMiddleware, authorizeRoles("ChuThue", "NguoiThue"), apartmentController.getAllApartments);

// Search phải đặt trước :id
router.get("/search", authMiddleware, authorizeRoles("ChuThue", "NguoiThue"), apartmentController.searchApartments);

router.get("/:id", authMiddleware, authorizeRoles("ChuThue", "NguoiThue"), apartmentController.getApartmentById);

// POST/PUT/DELETE - only ChuThue (Admin)
router.post("/", authMiddleware, authorizeRoles("ChuThue"), apartmentController.createApartment);

router.put("/:id", authMiddleware, authorizeRoles("ChuThue"), apartmentController.updateApartment);

router.delete("/:id", authMiddleware, authorizeRoles("ChuThue"), apartmentController.deleteApartment);

module.exports = router;
