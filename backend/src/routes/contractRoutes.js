const express = require("express");
const contractController = require("../controllers/contractController");
const contractPdfController = require("../controllers/contractPdfController");
const router = express.Router();

router.get("/expiring", contractController.getExpiringContracts);
router.get("/:id/pdf", contractPdfController.exportContractPdf);

router.get("/", contractController.getAllContracts);
router.post("/", contractController.createContract);
router.put("/:id", contractController.updateContract);
router.delete("/:id", contractController.deleteContract);

module.exports = router;
