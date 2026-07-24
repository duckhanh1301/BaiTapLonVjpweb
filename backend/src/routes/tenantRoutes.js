const express = require("express");
const tenantController = require("../controllers/tenantController");
const authMiddleware = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    authMiddleware,
    authorizeRoles("Admin", "NhanVien"),
    tenantController.getAllTenants
);
router.post(
    "/",
    authMiddleware,
    authorizeRoles("Admin"),
    tenantController.createTenant
);
router.put(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin", "NhanVien"),
    tenantController.updateTenant
);
router.delete(
    "/:id",
    authMiddleware,
    authorizeRoles("Admin"),
    tenantController.deleteTenant
);

module.exports = router;
