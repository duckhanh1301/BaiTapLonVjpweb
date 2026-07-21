const express = require("express");
const contractController = require("../controllers/contractController");

const router = express.Router();

router.get("/expiring", contractController.getExpiringContracts);

router.get("/", contractController.getAllContracts);
router.post("/", contractController.createContract);
router.put("/:id", contractController.updateContract);
router.delete("/:id", contractController.deleteContract);

module.exports = router;