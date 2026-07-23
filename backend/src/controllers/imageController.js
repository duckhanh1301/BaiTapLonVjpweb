const fs = require("fs");
const path = require("path");

const imageModel = require("../models/imageModel");

// Upload ảnh
const uploadImage = async (req, res) => {
    try {

        const { MaCanHo } = req.body;

        if (!MaCanHo) {
            return res.status(400).json({
                message: "Thiếu MaCanHo"
            });
        }

        if (!req.file) {
            return res.status(400).json({
                message: "Chưa chọn ảnh"
            });
        }

        const duongDanAnh = "/upload/" + req.file.filename;

        await imageModel.createImage(
            MaCanHo,
            duongDanAnh
        );

        res.status(201).json({
            message: "Upload ảnh thành công",
            image: duongDanAnh
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }
};

// Lấy danh sách ảnh của căn hộ
const getImages = async (req, res) => {

    try {

        const { maCanHo } = req.params;

        const images =
            await imageModel.getImagesByApartment(maCanHo);

        res.json(images);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// Xóa ảnh
const deleteImage = async (req, res) => {

    try {

        const { maAnh } = req.params;

        const image =
            await imageModel.getImageById(maAnh);

        if (!image) {

            return res.status(404).json({
                message: "Không tìm thấy ảnh"
            });

        }

        // Xóa file trong thư mục upload
        const filePath = path.join(
            __dirname,
            "..",
            image.DuongDanAnh
        );

        if (fs.existsSync(filePath)) {

            fs.unlinkSync(filePath);

        }

        await imageModel.deleteImage(maAnh);

        res.json({
            message: "Xóa ảnh thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

module.exports = {
    uploadImage,
    getImages,
    deleteImage
};