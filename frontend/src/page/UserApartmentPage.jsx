import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllApartments, searchApartments } from '../services/apartmentService';
import '../styles/UserApartmentPage.css';

const UserApartmentPage = () => {
    const [apartments, setApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    useEffect(() => {
        fetchApartments();
    }, []);

    const fetchApartments = async () => {
        try {
            setLoading(true);
            const data = await getAllApartments();
            setApartments(data);
            setFilteredApartments(data);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách căn hộ:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            if (searchTerm.trim()) {
                const data = await searchApartments(searchTerm);
                applyFilters(data);
            } else {
                applyFilters(apartments);
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
        }
    };

    const applyFilters = (data) => {
        let filtered = data;

        if (filterStatus) {
            filtered = filtered.filter(apt => apt.TrangThai === filterStatus);
        }

        if (minPrice) {
            filtered = filtered.filter(apt => apt.GiaThue >= Number(minPrice));
        }

        if (maxPrice) {
            filtered = filtered.filter(apt => apt.GiaThue <= Number(maxPrice));
        }

        setFilteredApartments(filtered);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        if (name === 'status') {
            setFilterStatus(value);
        } else if (name === 'minPrice') {
            setMinPrice(value);
        } else if (name === 'maxPrice') {
            setMaxPrice(value);
        }
    };

    const handleViewDetail = (apartment) => {
        setSelectedApartment(apartment);
        setShowDetail(true);
    };

    const formatCurrency = (value) => {
        return Number(value || 0).toLocaleString('vi-VN') + 'đ';
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) {
            return 'https://via.placeholder.com/300x200?text=No+Image';
        }
        // Nếu imagePath bắt đầu với /, nó là đường dẫn từ backend
        if (imagePath.startsWith('/')) {
            return `http://localhost:3000${imagePath}`;
        }
        return imagePath;
    };

    const getStatusBadge = (status) => {
        const statusMap = {
            'Trống': 'badge bg-success',
            'Đã thuê': 'badge bg-danger',
            'Đang sửa chữa': 'badge bg-warning'
        };
        return statusMap[status] || 'badge bg-secondary';
    };

    return (
        <div className="user-apartment-page">
            <div className="container py-4">
                <h1 className="mb-4">Danh Sách Căn Hộ</h1>

                {/* Search and Filter Section */}
                <div className="search-filter-section mb-4">
                    <form onSubmit={handleSearch} className="mb-3">
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Tìm theo tên căn hộ (VD: A101, Tòa A)"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="col-md-6 mb-2">
                                <button type="submit" className="btn btn-primary w-100">
                                    <i className="bi bi-search"></i> Tìm kiếm
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Filters */}
                    <div className="row">
                        <div className="col-md-3 mb-2">
                            <select
                                name="status"
                                className="form-select"
                                value={filterStatus}
                                onChange={handleFilterChange}
                            >
                                <option value="">-- Tất cả trạng thái --</option>
                                <option value="Trống">Trống</option>
                                <option value="Đã thuê">Đã thuê</option>
                                <option value="Đang sửa chữa">Đang sửa chữa</option>
                            </select>
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="number"
                                name="minPrice"
                                className="form-control"
                                placeholder="Giá từ"
                                value={minPrice}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <input
                                type="number"
                                name="maxPrice"
                                className="form-control"
                                placeholder="Giá đến"
                                value={maxPrice}
                                onChange={handleFilterChange}
                            />
                        </div>
                        <div className="col-md-3 mb-2">
                            <button
                                onClick={() => {
                                    setFilterStatus('');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSearchTerm('');
                                    setFilteredApartments(apartments);
                                }}
                                className="btn btn-secondary w-100"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>
                </div>

                {/* Apartments List */}
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Đang tải...</span>
                        </div>
                    </div>
                ) : filteredApartments.length === 0 ? (
                    <div className="alert alert-info">
                        Không tìm thấy căn hộ nào phù hợp
                    </div>
                ) : (
                    <div className="row">
                        {filteredApartments.map((apartment) => (
                            <div key={apartment.MaCanHo} className="col-md-6 col-lg-4 mb-4">
                                <div className="card apartment-card h-100">
                                    <div className="apartment-image-container">
                                        <img
                                            src={getImageUrl(apartment.HinhAnh)}
                                            className="card-img-top"
                                            alt={apartment.TenCanHo}
                                        />
                                        <span className={`${getStatusBadge(apartment.TrangThai)} position-absolute top-0 end-0 m-2`}>
                                            {apartment.TrangThai}
                                        </span>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{apartment.TenCanHo}</h5>
                                        <div className="apartment-info">
                                            <p className="mb-2">
                                                <strong>Diện tích:</strong> {apartment.DienTich} m²
                                            </p>
                                            <p className="mb-2">
                                                <strong>Giá thuê:</strong>
                                                <span className="text-danger ms-2">{formatCurrency(apartment.GiaThue)}</span>
                                            </p>
                                            <p className="mb-2">
                                                <strong>Tầng:</strong> {apartment.Tang}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Phòng ngủ:</strong> {apartment.SoPhongNgu}
                                            </p>
                                            <p className="mb-2">
                                                <strong>Phòng tắm:</strong> {apartment.SoPhongTam}
                                            </p>
                                            {apartment.MoTa && (
                                                <p className="mb-2">
                                                    <strong>Mô tả:</strong>
                                                    <br />
                                                    <small>{apartment.MoTa}</small>
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="card-footer bg-transparent">
                                        <button
                                            onClick={() => handleViewDetail(apartment)}
                                            className="btn btn-primary w-100"
                                        >
                                            Xem chi tiết
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {showDetail && selectedApartment && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Chi Tiết Căn Hộ</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowDetail(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <img
                                    src={getImageUrl(selectedApartment.HinhAnh)}
                                    className="img-fluid mb-3 w-100"
                                    alt={selectedApartment.TenCanHo}
                                    style={{ maxHeight: '400px', objectFit: 'cover' }}
                                />
                                <h4>{selectedApartment.TenCanHo}</h4>
                                <div className="detail-info">
                                    <p><strong>Diện tích:</strong> {selectedApartment.DienTich} m²</p>
                                    <p><strong>Giá thuê:</strong> {formatCurrency(selectedApartment.GiaThue)}</p>
                                    <p><strong>Tầng:</strong> {selectedApartment.Tang}</p>
                                    <p><strong>Phòng ngủ:</strong> {selectedApartment.SoPhongNgu}</p>
                                    <p><strong>Phòng tắm:</strong> {selectedApartment.SoPhongTam}</p>
                                    <p><strong>Trạng thái:</strong> <span className={getStatusBadge(selectedApartment.TrangThai)}>{selectedApartment.TrangThai}</span></p>
                                    {selectedApartment.MoTa && (
                                        <p><strong>Mô tả:</strong><br />{selectedApartment.MoTa}</p>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetail(false)}
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserApartmentPage;
