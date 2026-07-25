const express = require("express");

const router = express.Router();

const apartmentController = require("../controllers/apartmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.get("/", authMiddleware, authorizeRoles("Admin"), apartmentController.getAllApartments);

// Search phải đặt trước :id
router.get("/search", authMiddleware, authorizeRoles("Admin"), apartmentController.searchApartments);

router.get("/:id", authMiddleware, authorizeRoles("Admin"), apartmentController.getApartmentById);

router.post("/", apartmentController.createApartment);

router.put("/:id", apartmentController.updateApartment);

router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;