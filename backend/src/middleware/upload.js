const multer = require("multer");
const path = require("path");

// Cấu hình nơi lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../upload"));
    },

    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1E9);

        cb(
            null,
            uniqueName + path.extname(file.originalname)
        );
    },
});

// Chỉ cho upload ảnh
const fileFilter = (req, file, cb) => {

    const allowTypes = /jpg|jpeg|png|gif|webp/;

    const extName = allowTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    const mimeType = allowTypes.test(file.mimetype);

    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error("Chỉ được upload file ảnh!"));
    }
};

// Khởi tạo multer
const upload = multer({

    storage,

    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },

    fileFilter,
});

module.exports = upload;