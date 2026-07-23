const express = require("express");

const router = express.Router();

const apartmentController = require("../controllers/apartmentController");

router.get("/", apartmentController.getAllApartments);

// Search phải đặt trước :id
router.get("/search", apartmentController.searchApartments);

router.get("/:id", apartmentController.getApartmentById);

router.post("/", apartmentController.createApartment);

router.put("/:id", apartmentController.updateApartment);

router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;