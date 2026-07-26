import { useEffect, useState } from "react";
import {
    Buildings,
    Edit,
    MapIcon,
    Plus,
    Search,
    Trash
} from "@boxicons/react";

import {
    getAllBuildings,
    createBuilding,
    updateBuilding,
    deleteBuilding,
    searchBuildings
} from "../services/buildingService";

import BuildingForm from "../components/BuildingForm";
import "../styles/Management.css";

const BuildingPage = () => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const isOwner = user?.role === 'ChuThue';
    const [buildings, setBuildings] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedBuilding, setSelectedBuilding] = useState(null);

    const loadBuildings = async () => {
        try {
            const data = await getAllBuildings();
            setBuildings(data);
        } catch (err) {
            console.error(err);
            alert("Không tải được danh sách tòa nhà");
        }
    };

    useEffect(() => {
        if (!isOwner) return undefined;

        const fetchBuildings = async () => {
            try {
                const data = await getAllBuildings();
                setBuildings(data);
            } catch (err) {
                console.error(err);
                alert("Không tải được danh sách tòa nhà");
            }
        };

        fetchBuildings();
        return undefined;
    }, [isOwner]);

    const handleSearch = async () => {
        try {
            if (keyword.trim() === "") {
                loadBuildings();
                return;
            }

            const data = await searchBuildings(keyword.trim());
            setBuildings(data);
        } catch (err) {
            console.error(err);
            alert("Tìm kiếm tòa nhà thất bại");
        }
    };

    const handleAdd = () => {
        setSelectedBuilding(null);
        setShowModal(true);
    };

    const handleEdit = (building) => {
        setSelectedBuilding(building);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc muốn xóa tòa nhà này?")) return;

        try {
            await deleteBuilding(id);
            loadBuildings();
        } catch (err) {
            console.error(err);
            alert("Không thể xóa tòa nhà");
        }
    };

    const handleSave = async (data) => {
        try {
            if (selectedBuilding) {
                await updateBuilding(selectedBuilding.MaToaNha, data);
            } else {
                await createBuilding(data);
            }

            setShowModal(false);
            loadBuildings();
        } catch (err) {
            console.error(err);
            alert("Có lỗi xảy ra khi lưu tòa nhà");
        }
    };

    if (!isOwner) {
        return (
            <div className="management-page">
                <section className="management-hero">
                    <div className="management-heading">
                        <h2>Truy cập bị từ chối</h2>
                        <p>Chỉ chủ thuê mới được xem trang này.</p>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="management-page">
            <section className="management-hero">
                <div className="management-heading">
                    <span className="management-eyebrow">Danh mục tài sản</span>
                    <h2>Quản lý tòa nhà</h2>
                    <p>Quản lý địa điểm và thông tin các tòa nhà trong hệ thống.</p>
                </div>

                <button
                    className="management-primary-button"
                    type="button"
                    onClick={handleAdd}
                >
                    <Plus aria-hidden="true" />
                    <span>Thêm tòa nhà</span>
                </button>
            </section>

            <section className="management-panel">
                <header className="management-panel-header">
                    <div>
                        <h3>Danh sách tòa nhà</h3>
                        <p>
                            Hiện có <strong>{buildings.length}</strong> tòa nhà
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
                            aria-label="Tìm kiếm tòa nhà"
                            placeholder="Tìm theo tên hoặc địa chỉ..."
                            value={keyword}
                            onChange={(event) => setKeyword(event.target.value)}
                        />
                        <button type="submit">Tìm kiếm</button>
                    </form>
                </header>

                <div className="management-table-wrap">
                    <table className="management-table management-table--buildings">
                        <thead>
                            <tr>
                                <th>Mã</th>
                                <th>Tòa nhà</th>
                                <th>Địa chỉ</th>
                                <th>Mô tả</th>
                                <th className="management-actions-heading">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {buildings.length === 0 ? (
                                <tr>
                                    <td colSpan="5">
                                        <div className="management-empty">
                                            <span className="management-empty-icon">
                                                <Buildings aria-hidden="true" />
                                            </span>
                                            <strong>Chưa có tòa nhà</strong>
                                            <p>
                                                Thêm tòa nhà mới hoặc thử một từ khóa tìm kiếm khác.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                buildings.map((item) => (
                                    <tr key={item.MaToaNha}>
                                        <td>
                                            <span className="management-id">
                                                #{String(item.MaToaNha).padStart(2, "0")}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="management-name-cell">
                                                <span className="management-row-icon">
                                                    <Buildings aria-hidden="true" />
                                                </span>
                                                <div>
                                                    <strong>{item.TenToaNha}</strong>
                                                    <small>Tòa nhà đang quản lý</small>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="management-location">
                                                <MapIcon aria-hidden="true" />
                                                {item.DiaChi || "Chưa cập nhật"}
                                            </span>
                                        </td>
                                        <td>
                                            <p className="management-description">
                                                {item.MoTa || "Chưa có mô tả"}
                                            </p>
                                        </td>
                                        <td>
                                            <div className="management-actions">
                                                <button
                                                    className="management-icon-button is-edit"
                                                    type="button"
                                                    onClick={() => handleEdit(item)}
                                                    aria-label={`Sửa ${item.TenToaNha}`}
                                                >
                                                    <Edit aria-hidden="true" />
                                                    <span>Sửa</span>
                                                </button>
                                                <button
                                                    className="management-icon-button is-delete"
                                                    type="button"
                                                    onClick={() => handleDelete(item.MaToaNha)}
                                                    aria-label={`Xóa ${item.TenToaNha}`}
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
                <BuildingForm
                    show
                    building={selectedBuilding}
                    onClose={() => setShowModal(false)}
                    onSubmit={handleSave}
                />
            )}
        </div>
    );
};

export default BuildingPage;
