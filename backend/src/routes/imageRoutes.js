const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const imageController = require("../controllers/imageController");

// Upload ảnh
router.post(
    "/upload",
    upload.single("image"),
    imageController.uploadImage
);

// Lấy danh sách ảnh theo căn hộ
router.get("/:maCanHo", imageController.getImages);

// Xóa ảnh
router.delete("/:maAnh", imageController.deleteImage);

module.exports = router;