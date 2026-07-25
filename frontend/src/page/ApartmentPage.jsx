import { useEffect, useState } from "react";
import {
    Apartment,
    Bath,
    Bed,
    Edit,
    Image,
    Layers,
    Plus,
    Ruler,
    Search,
    Trash
} from "@boxicons/react";

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
import "../styles/Management.css";

const formatCurrency = (value) => (
    `${Number(value || 0).toLocaleString("vi-VN")} ₫`
);

const ApartmentPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user || user.role !== 'Admin') {
        return (
            <div className="management-page">
                <section className="management-hero">
                    <div className="management-heading">
                        <h2>Truy cập bị từ chối</h2>
                        <p>Chỉ người dùng có quyền Admin mới được xem trang này.</p>
                    </div>
                </section>
            </div>
        );
    }
    const [apartments, setApartments] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [imageApartment, setImageApartment] = useState(null);
    const [images, setImages] = useState([]);

    const loadApartments = async () => {
        try {
            const data = await getAllApartments();
            setApartments(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được danh sách căn hộ");
        }
    };

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [apartmentData, buildingData] = await Promise.all([
                    getAllApartments(),
                    getAllBuildings()
                ]);
                setApartments(apartmentData);
                setBuildings(buildingData);
            } catch (err) {
                console.error(err);
                alert("Không tải được dữ liệu căn hộ và tòa nhà");
            }
        };

        fetchInitialData();
    }, []);

    const loadImages = async (maCanHo) => {
        try {
            const data = await getImages(maCanHo);
            setImages(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được ảnh căn hộ");
        }
    };

    const handleSearch = async () => {
        try {
            if (keyword.trim() === "") {
                loadApartments();
                return;
            }

            const data = await searchApartments(keyword.trim());
            setApartments(data);
        } catch (err) {
            console.error(err);
            alert("Tìm kiếm căn hộ thất bại");
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
            // Map displayed status strings to backend-safe codes
            const mapStatus = (val) => {
                if (!val) return '';
                const s = String(val).toLowerCase();
                if (s.includes('trống') || s.includes('trong')) return 'Trong';
                if (s.includes('thuê') || s.includes('thue')) return 'DaThue';
                return val;
            };

            const payload = { ...data, TrangThai: mapStatus(data.TrangThai) };

            if (selectedApartment) {
                await updateApartment(selectedApartment.MaCanHo, payload);
            } else {
                await createApartment(payload);
            }

            setShowModal(false);
            loadApartments();
        } catch (err) {
            console.error(err);
              const msg = err?.response?.data?.message || err.message || "Có lỗi xảy ra khi lưu căn hộ";
              alert(msg);
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
            alert("Tải ảnh lên thất bại");
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

    const getStatusClassName = (status) => {
        const normalizedStatus = String(status || "").toLocaleLowerCase("vi");

        if (normalizedStatus.includes("trống")) return "is-available";
        if (normalizedStatus.includes("thuê")) return "is-rented";
        return "is-neutral";
    };

    return (
        <div className="management-page">
            <section className="management-hero">
                <div className="management-heading">
                    <span className="management-eyebrow">Danh mục tài sản</span>
                    <h2>Quản lý căn hộ</h2>
                    <p>Theo dõi giá thuê, trạng thái và thông tin vận hành căn hộ.</p>
                </div>

                <button
                    className="management-primary-button"
                    type="button"
                    onClick={handleAdd}
                >
                    <Plus aria-hidden="true" />
                    <span>Thêm căn hộ</span>
                </button>
            </section>

            <section className="management-panel">
                <header className="management-panel-header">
                    <div>
                        <h3>Danh sách căn hộ</h3>
                        <p>
                            Hiện có <strong>{apartments.length}</strong> căn hộ
                        </p>
                    </div>

                    <form
                        className="management-search"
                        onSubmit={(event) => {
                            event.preventDefault();
                            handleSearch();
                        }}
                    >
                        <Search aria-hidden="true" />
                        <input
                            aria-label="Tìm kiếm căn hộ"
                            placeholder="Tên căn hộ, trạng thái, tòa nhà..."
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                        <button type="submit">Tìm kiếm</button>
                    </form>
                </header>

                <div className="management-table-wrap">
                    <table className="management-table management-table--apartments">
                        <thead>
                            <tr>
                                <th>Căn hộ</th>
                                <th>Tòa nhà</th>
                                <th>Giá thuê</th>
                                <th>Thông số</th>
                                <th>Phòng</th>
                                <th>Trạng thái</th>
                                <th className="management-actions-heading">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apartments.length === 0 ? (
                                <tr>
                                    <td colSpan="7">
                                        <div className="management-empty">
                                            <span className="management-empty-icon">
                                                <Apartment aria-hidden="true" />
                                            </span>
                                            <strong>Chưa có căn hộ</strong>
                                            <p>
                                                Thêm căn hộ mới hoặc thử một từ khóa tìm kiếm khác.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                apartments.map((item) => (
                                    <tr key={item.MaCanHo}>
                                        <td>
                                            <div className="management-name-cell">
                                                <span className="management-row-icon is-apartment">
                                                    <Apartment aria-hidden="true" />
                                                </span>
                                                <div>
                                                    <strong>{item.TenCanHo}</strong>
                                                    <small>
                                                        #{String(item.MaCanHo).padStart(2, "0")}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="management-building-name">
                                                {item.TenToaNha || "Chưa cập nhật"}
                                            </span>
                                        </td>
                                        <td>
                                            <strong className="management-price">
                                                {formatCurrency(item.GiaThue)}
                                            </strong>
                                            <small className="management-unit">mỗi tháng</small>
                                        </td>
                                        <td>
                                            <div className="management-spec-list">
                                                <span>
                                                    <Ruler aria-hidden="true" />
                                                    {item.DienTich || 0} m²
                                                </span>
                                                <span>
                                                    <Layers aria-hidden="true" />
                                                    Tầng {item.Tang || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="management-room-list">
                                                <span title="Phòng ngủ">
                                                    <Bed aria-hidden="true" />
                                                    {item.SoPhongNgu || 0}
                                                </span>
                                                <span title="Phòng tắm">
                                                    <Bath aria-hidden="true" />
                                                    {item.SoPhongTam || 0}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            <span
                                                className={`management-status ${getStatusClassName(item.TrangThai)}`}
                                            >
                                                <i aria-hidden="true" />
                                                {item.TrangThai || "Chưa cập nhật"}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="management-actions">
                                                <button
                                                    className="management-icon-button is-image"
                                                    type="button"
                                                    onClick={() => handleOpenImages(item)}
                                                    aria-label={`Quản lý ảnh ${item.TenCanHo}`}
                                                >
                                                    <Image aria-hidden="true" />
                                                    <span>Ảnh</span>
                                                </button>
                                                <button
                                                    className="management-icon-button is-edit"
                                                    type="button"
                                                    onClick={() => handleEdit(item)}
                                                    aria-label={`Sửa ${item.TenCanHo}`}
                                                >
                                                    <Edit aria-hidden="true" />
                                                    <span>Sửa</span>
                                                </button>
                                                <button
                                                    className="management-icon-button is-delete"
                                                    type="button"
                                                    onClick={() => handleDelete(item.MaCanHo)}
                                                    aria-label={`Xóa ${item.TenCanHo}`}
                                                >
                                                    <Trash aria-hidden="true" />
                                                    <span>Xóa</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {showModal && (
                <ApartmentForm
                    show
                    apartment={selectedApartment}
                    buildings={buildings}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSave}
                />
            )}

            {showImageModal && (
                <UploadImage
                    show
                    onClose={() => setShowImageModal(false)}
                    apartment={imageApartment || {}}
                    images={images}
                    onUpload={handleUploadImage}
                    onDelete={handleDeleteImage}
                />
            )}
        </div>
    );
};

export default ApartmentPage;
