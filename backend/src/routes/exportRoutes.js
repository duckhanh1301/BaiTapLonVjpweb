const express = require("express");
const exportController = require("../controllers/exportController");

const router = express.Router();

router.get("/apartments", exportController.exportApartments);
router.get("/tenants", exportController.exportTenants);
router.get("/contracts", exportController.exportContracts);

module.exports = router;