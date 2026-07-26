const express = require("express");

const router = express.Router();

const apartmentController = require("../controllers/apartmentController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

router.use(authMiddleware, authorizeRoles("ChuThue"));

router.get("/", apartmentController.getAllApartments);

// Search phải đặt trước :id
router.get("/search", apartmentController.searchApartments);

router.get("/:id", apartmentController.getApartmentById);

router.post("/", apartmentController.createApartment);

router.put("/:id", apartmentController.updateApartment);

router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;
