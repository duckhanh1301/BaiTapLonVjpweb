import { useEffect, useState } from 'react';
import {
    FaArrowRight,
    FaBath,
    FaBed,
    FaBuilding,
    FaHome,
    FaLayerGroup,
    FaRulerCombined,
    FaSearch,
    FaSlidersH,
    FaTimes,
    FaUndo,
} from 'react-icons/fa';
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
    const [error, setError] = useState('');
    const [selectedApartment, setSelectedApartment] = useState(null);

    const fetchApartments = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await getAllApartments();
            const apartmentList = Array.isArray(data) ? data : [];
            setApartments(apartmentList);
            setFilteredApartments(apartmentList);
        } catch (fetchError) {
            console.error('Lỗi khi lấy danh sách căn hộ:', fetchError);
            setError('Không thể tải danh sách căn hộ. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isCancelled = false;

        getAllApartments()
            .then((data) => {
                if (isCancelled) return;
                const apartmentList = Array.isArray(data) ? data : [];
                setApartments(apartmentList);
                setFilteredApartments(apartmentList);
            })
            .catch((fetchError) => {
                if (isCancelled) return;
                console.error('Lỗi khi lấy danh sách căn hộ:', fetchError);
                setError('Không thể tải danh sách căn hộ. Vui lòng thử lại.');
            })
            .finally(() => {
                if (!isCancelled) setLoading(false);
            });

        return () => {
            isCancelled = true;
        };
    }, []);

    const applyFilters = (data) => {
        let filtered = Array.isArray(data) ? data : [];

        if (filterStatus) {
            filtered = filtered.filter((apartment) => (
                apartment.TrangThai === filterStatus
            ));
        }

        if (minPrice) {
            filtered = filtered.filter((apartment) => (
                Number(apartment.GiaThue) >= Number(minPrice)
            ));
        }

        if (maxPrice) {
            filtered = filtered.filter((apartment) => (
                Number(apartment.GiaThue) <= Number(maxPrice)
            ));
        }

        setFilteredApartments(filtered);
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        try {
            setError('');
            const data = searchTerm.trim()
                ? await searchApartments(searchTerm.trim())
                : apartments;
            applyFilters(data);
        } catch (searchError) {
            console.error('Lỗi tìm kiếm:', searchError);
            setError('Không thể tìm kiếm căn hộ. Vui lòng thử lại.');
        }
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;

        if (name === 'status') setFilterStatus(value);
        if (name === 'minPrice') setMinPrice(value);
        if (name === 'maxPrice') setMaxPrice(value);
    };

    const resetFilters = () => {
        setFilterStatus('');
        setMinPrice('');
        setMaxPrice('');
        setSearchTerm('');
        setFilteredApartments(apartments);
        setError('');
    };

    const formatCurrency = (value) => (
        `${Number(value || 0).toLocaleString('vi-VN')} ₫`
    );

    const getImageUrl = (imagePath) => {
        if (!imagePath) return '';
        if (imagePath.startsWith('/')) return `http://localhost:3000${imagePath}`;
        return imagePath;
    };

    const getStatusClass = (status) => {
        if (status === 'Trống') return 'is-available';
        if (status === 'Đã thuê') return 'is-rented';
        if (status === 'Đang sửa chữa') return 'is-maintenance';
        return 'is-unknown';
    };

    return (
        <div className="user-apartment-page">
            <form className="ua-filter-panel" onSubmit={handleSearch}>
                <div className="ua-filter-heading">
                    <div className="ua-filter-icon">
                        <FaSlidersH aria-hidden="true" />
                    </div>
                    <div>
                        <h2>Tìm căn hộ</h2>
                        <p>Nhập nhu cầu của bạn để thu hẹp kết quả.</p>
                    </div>
                </div>

                <div className="ua-search-row">
                    <label className="ua-field ua-search-field">
                        <span>Từ khóa</span>
                        <div className="ua-input-shell">
                            <FaSearch aria-hidden="true" />
                            <input
                                type="search"
                                placeholder="Tên căn hộ hoặc tòa nhà..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </label>

                    <label className="ua-field">
                        <span>Trạng thái</span>
                        <select
                            name="status"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="Trống">Đang trống</option>
                            <option value="Đã thuê">Đã thuê</option>
                            <option value="Đang sửa chữa">Đang sửa chữa</option>
                        </select>
                    </label>

                    <label className="ua-field">
                        <span>Giá từ</span>
                        <div className="ua-price-input">
                            <input
                                type="number"
                                name="minPrice"
                                min="0"
                                placeholder="0"
                                value={minPrice}
                                onChange={handleFilterChange}
                            />
                            <small>₫</small>
                        </div>
                    </label>

                    <label className="ua-field">
                        <span>Giá đến</span>
                        <div className="ua-price-input">
                            <input
                                type="number"
                                name="maxPrice"
                                min="0"
                                placeholder="Không giới hạn"
                                value={maxPrice}
                                onChange={handleFilterChange}
                            />
                            <small>₫</small>
                        </div>
                    </label>
                </div>

                <div className="ua-filter-actions">
                    <button type="button" className="ua-reset-button" onClick={resetFilters}>
                        <FaUndo aria-hidden="true" />
                        Xóa bộ lọc
                    </button>
                    <button type="submit" className="ua-search-button">
                        <FaSearch aria-hidden="true" />
                        Tìm kiếm
                    </button>
                </div>
            </form>

            <section className="ua-results" aria-live="polite">
                <header className="ua-results-header">
                    <div>
                        <span>Danh sách căn hộ</span>
                        <h2>Lựa chọn nổi bật</h2>
                    </div>
                    {!loading && !error && (
                        <p>
                            Hiển thị <strong>{filteredApartments.length}</strong> kết quả
                        </p>
                    )}
                </header>

                {error ? (
                    <div className="ua-state-card is-error" role="alert">
                        <div className="ua-state-icon"><FaHome aria-hidden="true" /></div>
                        <h3>Chưa thể tải dữ liệu</h3>
                        <p>{error}</p>
                        <button type="button" onClick={fetchApartments}>Thử lại</button>
                    </div>
                ) : loading ? (
                    <div className="ua-apartment-grid" aria-label="Đang tải căn hộ">
                        {[1, 2, 3].map((item) => (
                            <div className="ua-skeleton-card" key={item} aria-hidden="true">
                                <span className="ua-skeleton-image" />
                                <div>
                                    <span />
                                    <span />
                                    <span />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredApartments.length === 0 ? (
                    <div className="ua-state-card">
                        <div className="ua-state-icon"><FaSearch aria-hidden="true" /></div>
                        <h3>Không tìm thấy căn hộ phù hợp</h3>
                        <p>Hãy thử thay đổi từ khóa, trạng thái hoặc khoảng giá.</p>
                        <button type="button" onClick={resetFilters}>Xóa bộ lọc</button>
                    </div>
                ) : (
                    <div className="ua-apartment-grid">
                        {filteredApartments.map((apartment) => (
                            <article className="ua-apartment-card" key={apartment.MaCanHo}>
                                <div className="ua-card-media">
                                    <div className="ua-image-placeholder">
                                        <FaHome aria-hidden="true" />
                                        <span>Hình ảnh đang cập nhật</span>
                                    </div>
                                    {apartment.HinhAnh && (
                                        <img
                                            src={getImageUrl(apartment.HinhAnh)}
                                            alt={apartment.TenCanHo}
                                            onError={(event) => {
                                                event.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                    <span className={`ua-status ${getStatusClass(apartment.TrangThai)}`}>
                                        <i aria-hidden="true" />
                                        {apartment.TrangThai || 'Chưa cập nhật'}
                                    </span>
                                </div>

                                <div className="ua-card-body">
                                    <div className="ua-building-name">
                                        <FaBuilding aria-hidden="true" />
                                        <span>{apartment.TenToaNha || 'Tòa nhà chưa cập nhật'}</span>
                                    </div>

                                    <div className="ua-card-title-row">
                                        <h3>{apartment.TenCanHo}</h3>
                                        <span>Mã #{apartment.MaCanHo}</span>
                                    </div>

                                    <div className="ua-price">
                                        <strong>{formatCurrency(apartment.GiaThue)}</strong>
                                        <span>/ tháng</span>
                                    </div>

                                    <div className="ua-amenities">
                                        <div>
                                            <FaRulerCombined aria-hidden="true" />
                                            <span><strong>{apartment.DienTich || 0}</strong> m²</span>
                                        </div>
                                        <div>
                                            <FaBed aria-hidden="true" />
                                            <span><strong>{apartment.SoPhongNgu || 0}</strong> phòng ngủ</span>
                                        </div>
                                        <div>
                                            <FaBath aria-hidden="true" />
                                            <span><strong>{apartment.SoPhongTam || 0}</strong> phòng tắm</span>
                                        </div>
                                        <div>
                                            <FaLayerGroup aria-hidden="true" />
                                            <span>Tầng <strong>{apartment.Tang || '—'}</strong></span>
                                        </div>
                                    </div>

                                    <p className="ua-description">
                                        {apartment.MoTa || 'Thông tin mô tả căn hộ đang được cập nhật.'}
                                    </p>

                                    <button
                                        type="button"
                                        className="ua-detail-button"
                                        onClick={() => setSelectedApartment(apartment)}
                                    >
                                        Xem chi tiết
                                        <FaArrowRight aria-hidden="true" />
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {selectedApartment && (
                <div
                    className="ua-modal-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setSelectedApartment(null);
                    }}
                >
                    <section
                        className="ua-detail-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="ua-detail-title"
                    >
                        <button
                            type="button"
                            className="ua-modal-close"
                            aria-label="Đóng chi tiết căn hộ"
                            onClick={() => setSelectedApartment(null)}
                        >
                            <FaTimes aria-hidden="true" />
                        </button>

                        <div className="ua-modal-media">
                            <div className="ua-image-placeholder">
                                <FaHome aria-hidden="true" />
                                <span>Hình ảnh đang cập nhật</span>
                            </div>
                            {selectedApartment.HinhAnh && (
                                <img
                                    src={getImageUrl(selectedApartment.HinhAnh)}
                                    alt={selectedApartment.TenCanHo}
                                    onError={(event) => {
                                        event.currentTarget.style.display = 'none';
                                    }}
                                />
                            )}
                            <span className={`ua-status ${getStatusClass(selectedApartment.TrangThai)}`}>
                                <i aria-hidden="true" />
                                {selectedApartment.TrangThai || 'Chưa cập nhật'}
                            </span>
                        </div>

                        <div className="ua-modal-content">
                            <div className="ua-building-name">
                                <FaBuilding aria-hidden="true" />
                                <span>{selectedApartment.TenToaNha || 'Tòa nhà chưa cập nhật'}</span>
                            </div>
                            <h2 id="ua-detail-title">{selectedApartment.TenCanHo}</h2>
                            <div className="ua-modal-price">
                                <strong>{formatCurrency(selectedApartment.GiaThue)}</strong>
                                <span>/ tháng</span>
                            </div>

                            <div className="ua-modal-specs">
                                <div>
                                    <FaRulerCombined aria-hidden="true" />
                                    <span>Diện tích</span>
                                    <strong>{selectedApartment.DienTich || 0} m²</strong>
                                </div>
                                <div>
                                    <FaLayerGroup aria-hidden="true" />
                                    <span>Tầng</span>
                                    <strong>{selectedApartment.Tang || '—'}</strong>
                                </div>
                                <div>
                                    <FaBed aria-hidden="true" />
                                    <span>Phòng ngủ</span>
                                    <strong>{selectedApartment.SoPhongNgu || 0}</strong>
                                </div>
                                <div>
                                    <FaBath aria-hidden="true" />
                                    <span>Phòng tắm</span>
                                    <strong>{selectedApartment.SoPhongTam || 0}</strong>
                                </div>
                            </div>

                            <div className="ua-modal-description">
                                <h3>Mô tả căn hộ</h3>
                                <p>
                                    {selectedApartment.MoTa
                                        || 'Thông tin mô tả căn hộ đang được cập nhật.'}
                                </p>
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </div>
    );
};

export default UserApartmentPage;
