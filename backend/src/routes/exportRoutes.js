const express = require("express");
const exportController = require("../controllers/exportController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(authMiddleware, authorizeRoles("ChuThue"));

router.get("/apartments", exportController.exportApartments);
router.get("/tenants", exportController.exportTenants);
router.get("/contracts", exportController.exportContracts);

module.exports = router;
