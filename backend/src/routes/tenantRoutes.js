const express = require("express");
const tenantController = require("../controllers/tenantController");

const router = express.Router();

router.get("/", tenantController.getAllTenants);
router.post("/", tenantController.createTenant);
router.put("/:id", tenantController.updateTenant);
router.delete("/:id", tenantController.deleteTenant);

module.exports = router;