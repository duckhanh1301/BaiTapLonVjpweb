import { useEffect, useState } from "react";

import {
    getAllApartments,
    createApartment,
    updateApartment,
    deleteApartment,
    searchApartments
} from "../services/apartmentService";

import { getAllBuildings } from "../services/buildingService";
import { getImages, uploadImage, deleteImage } from "../services/imageService";
import ApartmentForm from "../components/ApartmentForm";
import UploadImage from "../components/UploadImage";

const ApartmentPage = () => {
    const [apartments, setApartments] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageApartment, setImageApartment] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        loadApartments();
        loadBuildings();
    }, []);

    const loadApartments = async () => {
        try {
            const data = await getAllApartments();
            setApartments(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được danh sách căn hộ");
        }
    };

    const loadBuildings = async () => {
        try {
            const data = await getAllBuildings();
            setBuildings(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được danh sách tòa nhà");
        }
    };

    const loadImages = async (maCanHo) => {
        try {
            const data = await getImages(maCanHo);
            setImages(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được ảnh");
        }
    };

    const handleSearch = async () => {
        try {
            if (keyword.trim() === "") {
                loadApartments();
                return;
            }
            const data = await searchApartments(keyword);
            setApartments(data);
        } catch (err) {
            console.error(err);
            alert("Tìm kiếm thất bại");
        }
    };

    const handleAdd = () => {
        setSelectedApartment(null);
        setShowModal(true);
    };

    const handleEdit = (apartment) => {
        setSelectedApartment(apartment);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa căn hộ này?")) return;
        try {
            await deleteApartment(id);
            loadApartments();
        } catch (err) {
            console.error(err);
            alert("Không thể xóa căn hộ");
        }
    };

    const handleSave = async (data) => {
        try {
            if (selectedApartment) {
                await updateApartment(selectedApartment.MaCanHo, data);
            } else {
                await createApartment(data);
            }
            setShowModal(false);
            loadApartments();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu căn hộ");
        }
    };

    const handleOpenImages = async (apartment) => {
        setImageApartment(apartment);
        setShowImageModal(true);
        await loadImages(apartment.MaCanHo);
    };

    const handleUploadImage = async (formData) => {
        try {
            await uploadImage(formData);
            await loadImages(imageApartment.MaCanHo);
        } catch (err) {
            console.error(err);
            alert("Upload ảnh thất bại");
        }
    };

    const handleDeleteImage = async (maAnh) => {
        if (!window.confirm("Bạn có chắc muốn xóa ảnh này?")) return;
        try {
            await deleteImage(maAnh);
            await loadImages(imageApartment.MaCanHo);
        } catch (err) {
            console.error(err);
            alert("Xóa ảnh thất bại");
        }
    };

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between mb-3">
                <h2>Quản lý căn hộ</h2>
                <button className="btn btn-success" onClick={handleAdd}>
                    + Thêm
                </button>
            </div>

            <div className="input-group mb-3">
                <input
                    className="form-control"
                    placeholder="Tìm kiếm tên căn hộ, trạng thái, tòa nhà..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button className="btn btn-primary" onClick={handleSearch}>
                    Tìm kiếm
                </button>
            </div>

            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Tên căn hộ</th>
                        <th>Tòa nhà</th>
                        <th>Giá thuê</th>
                        <th>Diện tích</th>
                        <th>Tầng</th>
                        <th>Phòng ngủ</th>
                        <th>Phòng tắm</th>
                        <th>Trạng thái</th>
                        <th width="250">Thao tác</th>
                    </tr>
                </thead>
                <tbody>
                    {apartments.length === 0 ? (
                        <tr>
                            <td colSpan="10" className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    ) : (
                        apartments.map((item) => (
                            <tr key={item.MaCanHo}>
                                <td>{item.MaCanHo}</td>
                                <td>{item.TenCanHo}</td>
                                <td>{item.TenToaNha}</td>
                                <td>{item.GiaThue}</td>
                                <td>{item.DienTich}</td>
                                <td>{item.Tang}</td>
                                <td>{item.SoPhongNgu}</td>
                                <td>{item.SoPhongTam}</td>
                                <td>{item.TrangThai}</td>
                                <td>
                                    <button
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => handleOpenImages(item)}
                                    >
                                        Ảnh
                                    </button>
                                    <button
                                        className="btn btn-warning btn-sm me-2"
                                        onClick={() => handleEdit(item)}
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDelete(item.MaCanHo)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            <ApartmentForm
                show={showModal}
                apartment={selectedApartment}
                buildings={buildings}
                onClose={() => setShowModal(false)}
                onSubmit={handleSave}
            />

            <UploadImage
                show={showImageModal}
                onClose={() => setShowImageModal(false)}
                apartment={imageApartment || {}}
                images={images}
                onUpload={handleUploadImage}
                onDelete={handleDeleteImage}
            />
        </div>
    );
};

export default ApartmentPage;
