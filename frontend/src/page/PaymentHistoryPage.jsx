// import { useEffect, useState } from 'react';
// import { getPayments } from '../services/paymentService';
// import '../styles/PaymentHistoryPage.css';
// const status = { ChoThanhToan: 'Chờ thanh toán', DaThanhToan: 'Đã thanh toán', QuaHan: 'Quá hạn', TuChoi: 'Từ chối' };
// const PaymentHistoryPage = () => {
//     const [payments, setPayments] = useState([]); const [error, setError] = useState('');
//     useEffect(() => { getPayments().then(setPayments).catch(() => setError('Không thể tải hóa đơn.')); }, []);
//     const money = x => Number(x || 0).toLocaleString('vi-VN') + ' đ';
//     return <div className="payment-history-page"><div className="container py-4"><h1 className="mb-4">Hóa đơn & thanh toán</h1>{error && <div className="alert alert-danger">{error}</div>}<div className="card"><div className="card-body table-responsive"><table className="table table-hover mb-0"><thead><tr><th>Kỳ thanh toán</th><th>Căn hộ</th><th>Số tiền</th><th>Hạn thanh toán</th><th>Ngày thanh toán</th><th>Trạng thái</th></tr></thead><tbody>{payments.length ? payments.map(x => <tr key={x.MaHoaDon}><td>{new Date(x.KyThanhToan).toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' })}</td><td>{x.TenCanHo}</td><td className="fw-bold">{money(x.SoTien)}</td><td>{new Date(x.HanThanhToan).toLocaleDateString('vi-VN')}</td><td>{x.NgayThanhToan ? new Date(x.NgayThanhToan).toLocaleDateString('vi-VN') : '--'}</td><td><span className="badge bg-secondary">{status[x.TrangThai] || x.TrangThai}</span></td></tr>) : <tr><td colSpan="6" className="text-center text-muted py-4">Chưa có hóa đơn.</td></tr>}</tbody></table></div></div></div></div>;
// };
// export default PaymentHistoryPage;
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
