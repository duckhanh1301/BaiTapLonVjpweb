const express = require("express");

const router = express.Router();

const apartmentController = require("../controllers/apartmentController");

router.get("/", apartmentController.getAllApartments);

router.post("/", apartmentController.createApartment);

router.put("/:id", apartmentController.updateApartment);

router.delete("/:id", apartmentController.deleteApartment);

module.exports = router;