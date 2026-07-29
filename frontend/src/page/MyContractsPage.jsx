// import { useEffect, useState } from 'react';
// import { getMyContracts } from '../services/contractService';
// import '../styles/MyContractsPage.css';

// const MyContractsPage = () => {
//     const [contracts, setContracts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     useEffect(() => {
//         fetchMyContracts();
//     }, []);

//     const fetchMyContracts = async () => {
//         try {
//             setLoading(true);
//             const data = await getMyContracts();
//             setContracts(data);
//         } catch (err) {
//             console.error('Lỗi khi lấy hợp đồng:', err);
//             setError('Không thể lấy danh sách hợp đồng của bạn');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const formatCurrency = (value) => {
//         return Number(value || 0).toLocaleString('vi-VN') + 'đ';
//     };

//     const formatDate = (date) => {
//         return new Date(date).toLocaleDateString('vi-VN');
//     };

//     const getStatusBadge = (status) => {
//         const statusMap = {
//             'HieuLuc': 'bg-success',
//             'HetHan': 'bg-danger',
//             'DaHuy': 'bg-secondary'
//         };
//         const statusText = {
//             'HieuLuc': 'Hiệu lực',
//             'HetHan': 'Hết hạn',
//             'DaHuy': 'Đã hủy'
//         };
//         return (
//             <span className={`badge ${statusMap[status] || 'bg-secondary'}`}>
//                 {statusText[status] || status}
//             </span>
//         );
//     };

//     return (
//         <div className="my-contracts-page">
//             <div className="container py-4">
//                 <h1 className="mb-4">Hợp Đồng Của Tôi</h1>

//                 {loading ? (
//                     <div className="text-center">
//                         <div className="spinner-border" role="status">
//                             <span className="visually-hidden">Đang tải...</span>
//                         </div>
//                     </div>
//                 ) : error ? (
//                     <div className="alert alert-danger">{error}</div>
//                 ) : contracts.length === 0 ? (
//                     <div className="alert alert-info">
//                         Bạn hiện không có hợp đồng nào.
//                     </div>
//                 ) : (
//                     <div className="contracts-list">
//                         {contracts.map((contract) => (
//                             <div key={contract.MaHopDong} className="card mb-3 contract-card">
//                                 <div className="card-header bg-light">
//                                     <div className="row align-items-center">
//                                         <div className="col-md-6">
//                                             <h5 className="mb-0">{contract.TenCanHo} - {contract.TenToaNha}</h5>
//                                         </div>
//                                         <div className="col-md-6 text-end">
//                                             {getStatusBadge(contract.TrangThai)}
//                                         </div>
//                                     </div>
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="row mb-3">
//                                         <div className="col-md-6">
//                                             <p><strong>Người thuê:</strong> {contract.HoTen}</p>
//                                             <p><strong>CCCD:</strong> {contract.CCCD}</p>
//                                             <p><strong>Số điện thoại:</strong> {contract.SoDienThoai}</p>
//                                             <p><strong>Email:</strong> {contract.Email}</p>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <p><strong>Ngày bắt đầu:</strong> {formatDate(contract.NgayBatDau)}</p>
//                                             <p><strong>Ngày kết thúc:</strong> {formatDate(contract.NgayKetThuc)}</p>
//                                             <p><strong>Giá thuê:</strong> <span className="text-danger">{formatCurrency(contract.GiaThue)}</span>/tháng</p>
//                                             {contract.TienCoc && (
//                                                 <p><strong>Tiền cọc:</strong> {formatCurrency(contract.TienCoc)}</p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="row">
//                                         <div className="col-md-6">
//                                             <p><strong>Địa chỉ tòa nhà:</strong> {contract.DiaChiToaNha}</p>
//                                             <p><strong>Tầng:</strong> {contract.Tang}</p>
//                                         </div>
//                                         <div className="col-md-6">
//                                             <p><strong>Diện tích:</strong> {contract.DienTich} m²</p>
//                                             <p><strong>Phòng ngủ / Phòng tắm:</strong> {contract.SoPhongNgu}/{contract.SoPhongTam}</p>
//                                         </div>
//                                     </div>

//                                     {contract.GhiChu && (
//                                         <div className="row mt-3">
//                                             <div className="col-12">
//                                                 <p><strong>Ghi chú:</strong></p>
//                                                 <p className="text-muted">{contract.GhiChu}</p>
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default MyContractsPage;
import { useEffect, useState } from 'react';
import {
    FaBuilding,
    FaCalendarDays,
    FaFileContract,
    FaHouse,
    FaLocationDot,
    FaMoneyBillWave,
    FaUser,
} from 'react-icons/fa6';
import { getMyContracts } from '../services/contractService';
import '../styles/MyContractsPage.css';

const contractStatus = {
    HieuLuc: { label: 'Đang hiệu lực', className: 'is-active' },
    HetHan: { label: 'Đã hết hạn', className: 'is-expired' },
    DaHuy: { label: 'Đã hủy', className: 'is-cancelled' },
};

const MyContractsPage = () => {
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMyContracts = async () => {
            try {
                setLoading(true);
                const data = await getMyContracts();
                setContracts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi khi lấy hợp đồng:', err);
                setError('Không thể lấy danh sách hợp đồng của bạn.');
            } finally {
                setLoading(false);
            }
        };

        fetchMyContracts();
    }, []);

    const formatCurrency = (value) => (
        `${Number(value || 0).toLocaleString('vi-VN')} đ`
    );

    const formatDate = (date) => (
        date ? new Date(date).toLocaleDateString('vi-VN') : 'Chưa cập nhật'
    );

    return (
        <div className="my-contracts-page">
            <div className="contracts-page-container">
                <header className="contracts-page-header">
                    <div>
                        <span className="contracts-eyebrow">Không gian người thuê</span>
                        <h1>Hợp đồng của tôi</h1>
                        <p>Theo dõi thời hạn, chi phí và thông tin căn hộ đang thuê.</p>
                    </div>
                    {!loading && !error && (
                        <div className="contracts-total" aria-label={`${contracts.length} hợp đồng`}>
                            <FaFileContract aria-hidden="true" />
                            <span>
                                <strong>{contracts.length}</strong>
                                Hợp đồng
                            </span>
                        </div>
                    )}
                </header>

                {loading ? (
                    <div className="contracts-state" role="status">
                        <span className="contracts-spinner" aria-hidden="true" />
                        <strong>Đang tải hợp đồng</strong>
                        <p>Vui lòng chờ trong giây lát...</p>
                    </div>
                ) : error ? (
                    <div className="contracts-state is-error" role="alert">
                        <FaFileContract aria-hidden="true" />
                        <strong>Chưa thể hiển thị hợp đồng</strong>
                        <p>{error}</p>
                    </div>
                ) : contracts.length === 0 ? (
                    <div className="contracts-state">
                        <FaFileContract aria-hidden="true" />
                        <strong>Chưa có hợp đồng</strong>
                        <p>Hợp đồng thuê của bạn sẽ xuất hiện tại đây khi được tạo.</p>
                    </div>
                ) : (
                    <section className="contracts-list" aria-label="Danh sách hợp đồng">
                        {contracts.map((contract) => {
                            const currentStatus = contractStatus[contract.TrangThai] || {
                                label: contract.TrangThai || 'Chưa cập nhật',
                                className: 'is-unknown',
                            };

                            return (
                                <article key={contract.MaHopDong} className="contract-card">
                                    <div className="contract-card-top">
                                        <div className="contract-title-group">
                                            <span className="contract-icon" aria-hidden="true">
                                                <FaHouse />
                                            </span>
                                            <div>
                                                <span className="contract-code">
                                                    Hợp đồng #{contract.MaHopDong}
                                                </span>
                                                <h2>{contract.TenCanHo || 'Căn hộ chưa cập nhật'}</h2>
                                                <p>
                                                    <FaBuilding aria-hidden="true" />
                                                    {contract.TenToaNha || 'Tòa nhà chưa cập nhật'}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`contract-status ${currentStatus.className}`}>
                                            <i aria-hidden="true" />
                                            {currentStatus.label}
                                        </span>
                                    </div>

                                    <div className="contract-rent-summary">
                                        <div>
                                            <FaMoneyBillWave aria-hidden="true" />
                                            <span>
                                                Giá thuê hàng tháng
                                                <strong>{formatCurrency(contract.GiaThue)}</strong>
                                            </span>
                                        </div>
                                        <div>
                                            <FaCalendarDays aria-hidden="true" />
                                            <span>
                                                Thời hạn hợp đồng
                                                <strong>
                                                    {formatDate(contract.NgayBatDau)} — {formatDate(contract.NgayKetThuc)}
                                                </strong>
                                            </span>
                                        </div>
                                    </div>

                                    <div className="contract-card-body">
                                        <section className="contract-info-section">
                                            <h3><FaUser aria-hidden="true" /> Thông tin người thuê</h3>
                                            <dl className="contract-info-grid">
                                                <div><dt>Họ và tên</dt><dd>{contract.HoTen || '—'}</dd></div>
                                                <div><dt>CCCD</dt><dd>{contract.CCCD || '—'}</dd></div>
                                                <div><dt>Số điện thoại</dt><dd>{contract.SoDienThoai || '—'}</dd></div>
                                                <div><dt>Email</dt><dd>{contract.Email || '—'}</dd></div>
                                            </dl>
                                        </section>

                                        <section className="contract-info-section">
                                            <h3><FaBuilding aria-hidden="true" /> Thông tin căn hộ</h3>
                                            <dl className="contract-info-grid">
                                                <div className="is-wide">
                                                    <dt>Địa chỉ tòa nhà</dt>
                                                    <dd><FaLocationDot aria-hidden="true" /> {contract.DiaChiToaNha || '—'}</dd>
                                                </div>
                                                <div><dt>Tầng</dt><dd>{contract.Tang ?? '—'}</dd></div>
                                                <div><dt>Diện tích</dt><dd>{contract.DienTich || 0} m²</dd></div>
                                                <div><dt>Phòng ngủ / Phòng tắm</dt><dd>{contract.SoPhongNgu || 0} / {contract.SoPhongTam || 0}</dd></div>
                                                <div><dt>Tiền cọc</dt><dd>{formatCurrency(contract.TienCoc)}</dd></div>
                                            </dl>
                                        </section>
                                    </div>

                                    {contract.GhiChu && (
                                        <div className="contract-note">
                                            <strong>Ghi chú</strong>
                                            <p>{contract.GhiChu}</p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </section>
                )}
            </div>
        </div>
    );
};

export default MyContractsPage;
