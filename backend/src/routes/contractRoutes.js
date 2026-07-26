const express = require("express");
const contractController = require("../controllers/contractController");
const contractPdfController = require("../controllers/contractPdfController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// User routes (accessible by NguoiThue)
router.get("/my-contracts", authorizeRoles("NguoiThue"), contractController.getUserContracts);

// Admin routes (accessible by ChuThue)
router.get("/expiring", authorizeRoles("ChuThue"), contractController.getExpiringContracts);
router.get("/options", authorizeRoles("ChuThue"), contractController.getContractOptions);
router.get("/:id/pdf", contractPdfController.exportContractPdf);
router.get("/", authorizeRoles("ChuThue"), contractController.getAllContracts);
router.post("/", authorizeRoles("ChuThue"), contractController.createContract);
router.put("/:id", authorizeRoles("ChuThue"), contractController.updateContract);
router.delete("/:id", authorizeRoles("ChuThue"), contractController.deleteContract);

module.exports = router;
