const express = require("express");
const tenantController = require("../controllers/tenantController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    authorizeRoles("ChuThue", "NguoiThue"),
    tenantController.getAllTenants
);
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("ChuThue", "NguoiThue"),
    tenantController.updateTenant
);
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("ChuThue"),
    tenantController.deleteTenant
);

module.exports = router;
