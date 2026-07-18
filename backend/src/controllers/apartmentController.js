const apartmentModel = require("../models/apartmentModel");

// GET
const getAllApartments = async (req, res) => {

    try {

        const data = await apartmentModel.getAllApartments();

        res.status(200).json(data);

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// POST
const createApartment = async (req, res) => {

    try {

        const {
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        } = req.body;

        await apartmentModel.createApartment(
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        );

        res.status(201).json({
            message: "Thêm căn hộ thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// PUT
const updateApartment = async (req, res) => {

    try {

        const id = req.params.id;

        const {
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        } = req.body;

        const result = await apartmentModel.updateApartment(
            id,
            MaToaNha,
            TenCanHo,
            GiaThue,
            DienTich,
            Tang,
            SoPhongNgu,
            SoPhongTam,
            TrangThai,
            MoTa
        );

        if(result.affectedRows==0){

            return res.status(404).json({
                message:"Không tìm thấy căn hộ"
            });

        }

        res.json({
            message:"Cập nhật thành công"
        });

    } catch (err) {

        res.status(500).json({
            message: err.message
        });

    }

};

// DELETE
const deleteApartment = async(req,res)=>{

    try{

        const result=await apartmentModel.deleteApartment(req.params.id);

        if(result.affectedRows==0){

            return res.status(404).json({
                message:"Không tìm thấy căn hộ"
            });

        }

        res.json({
            message:"Xóa thành công"
        });

    }catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};

module.exports={
    getAllApartments,
    createApartment,
    updateApartment,
    deleteApartment
}