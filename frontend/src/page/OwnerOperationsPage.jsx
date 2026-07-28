import { useEffect, useMemo, useState } from 'react';
import {
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiCreditCard,
    FiDollarSign,
    FiFileText,
    FiHome,
    FiInbox,
    FiTool,
    FiUser,
} from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from '../services/axiosConfig';
import '../styles/OwnerOperationsPage.css';

const repairLabels = {
    ChoXuLy: 'Chờ xử lý',
    DangXuLy: 'Đang xử lý',
    HoanThanh: 'Hoàn thành',
    TuChoi: 'Từ chối',
};

const paymentLabels = {
    ChoThanhToan: 'Chờ thanh toán',
    DaThanhToan: 'Đã thanh toán',
    QuaHan: 'Quá hạn',
    TuChoi: 'Từ chối',
};

const initialForm = {
    contractId: '',
    period: '',
    amount: '',
    dueDate: '',
    note: '',
};

const formatMoney = (value) => `${Number(value || 0).toLocaleString('vi-VN')} đ`;

const formatDate = (value, options) => {
    if (!value) return '--';

    return new Date(value).toLocaleDateString('vi-VN', options);
};

const fetchOperationsData = async () => {
    const [repairResponse, paymentResponse, contractResponse] = await Promise.all([
        axios.get('/repairs'),
        axios.get('/payments'),
        axios.get('/contracts'),
    ]);

    return {
        repairs: repairResponse.data,
        payments: paymentResponse.data,
        contracts: contractResponse.data.filter(
            (contract) => contract.TrangThai === 'HieuLuc',
        ),
    };
};

const OwnerOperationsPage = () => {
    const [repairs, setRepairs] = useState([]);
    const [payments, setPayments] = useState([]);
    const [contracts, setContracts] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [loading, setLoading] = useState(true);
    const [creatingPayment, setCreatingPayment] = useState(false);
    const [updatingRepairId, setUpdatingRepairId] = useState(null);
    const [markingPaidId, setMarkingPaidId] = useState(null);

    const load = async () => {
        try {
            const data = await fetchOperationsData();
            setRepairs(data.repairs);
            setPayments(data.payments);
            setContracts(data.contracts);
        } catch {
            toast.error('Không thể tải dữ liệu quản lý.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        fetchOperationsData()
            .then((data) => {
                if (cancelled) return;

                setRepairs(data.repairs);
                setPayments(data.payments);
                setContracts(data.contracts);
            })
            .catch(() => {
                if (!cancelled) toast.error('Không thể tải dữ liệu quản lý.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    const overview = useMemo(() => ({
        openRepairs: repairs.filter((item) => (
            item.TrangThai === 'ChoXuLy' || item.TrangThai === 'DangXuLy'
        )).length,
        unpaidPayments: payments.filter((item) => item.TrangThai !== 'DaThanhToan').length,
        paidPayments: payments.filter((item) => item.TrangThai === 'DaThanhToan').length,
    }), [payments, repairs]);

    const updateRepair = async (id, status) => {
        setUpdatingRepairId(id);

        try {
            await axios.patch(`/repairs/${id}/status`, { status });
            toast.success('Đã cập nhật trạng thái yêu cầu.');
            await load();
        } catch {
            toast.error('Cập nhật thất bại.');
        } finally {
            setUpdatingRepairId(null);
        }
    };

    const markPaid = async (id) => {
        setMarkingPaidId(id);

        try {
            await axios.patch(`/payments/${id}/paid`, {});
            toast.success('Đã xác nhận thanh toán.');
            await load();
        } catch {
            toast.error('Cập nhật thất bại.');
        } finally {
            setMarkingPaidId(null);
        }
    };

    const createPayment = async (event) => {
        event.preventDefault();
        setCreatingPayment(true);

        try {
            await axios.post('/payments', form);
            toast.success('Đã tạo hóa đơn.');
            setForm(initialForm);
            await load();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Tạo hóa đơn thất bại.');
        } finally {
            setCreatingPayment(false);
        }
    };

    const handleContractChange = (event) => {
        const contractId = event.target.value;
        const selectedContract = contracts.find(
            (contract) => String(contract.MaHopDong) === contractId,
        );

        setForm((currentForm) => ({
            ...currentForm,
            contractId,
            amount: selectedContract?.GiaThue || currentForm.amount,
        }));
    };

    return (
        <div className="operations-page">
            <div className="operations-heading">
                <div>
                    <span className="operations-eyebrow">Quản lý hằng ngày</span>
                    <h1>Vận hành nhà cho thuê</h1>
                    <p>Theo dõi yêu cầu sửa chữa và quản lý hóa đơn tại một nơi.</p>
                </div>
            </div>

            <section className="operations-overview" aria-label="Tổng quan vận hành">
                <article className="operations-stat operations-stat--repair">
                    <span className="operations-stat-icon"><FiTool aria-hidden="true" /></span>
                    <div>
                        <span>Cần xử lý</span>
                        <strong>{overview.openRepairs}</strong>
                        <small>yêu cầu sửa chữa</small>
                    </div>
                </article>
                <article className="operations-stat operations-stat--payment">
                    <span className="operations-stat-icon"><FiClock aria-hidden="true" /></span>
                    <div>
                        <span>Chờ thanh toán</span>
                        <strong>{overview.unpaidPayments}</strong>
                        <small>hóa đơn cần theo dõi</small>
                    </div>
                </article>
                <article className="operations-stat operations-stat--complete">
                    <span className="operations-stat-icon"><FiCheckCircle aria-hidden="true" /></span>
                    <div>
                        <span>Đã hoàn tất</span>
                        <strong>{overview.paidPayments}</strong>
                        <small>hóa đơn đã thu</small>
                    </div>
                </article>
            </section>

            <section className="operations-card operations-repairs">
                <header className="operations-card-header">
                    <div className="operations-card-title">
                        <span className="operations-card-icon operations-card-icon--orange">
                            <FiTool aria-hidden="true" />
                        </span>
                        <div>
                            <span>Bảo trì</span>
                            <h2>Yêu cầu sửa chữa</h2>
                        </div>
                    </div>
                    <span className="operations-count">{repairs.length} yêu cầu</span>
                </header>

                <div className="operations-table-wrap">
                    <table className="operations-table operations-repair-table">
                        <thead>
                            <tr>
                                <th>Người thuê</th>
                                <th>Căn hộ</th>
                                <th>Nội dung sự cố</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {!loading && repairs.map((repair) => (
                                <tr key={repair.MaYeuCau}>
                                    <td>
                                        <div className="operations-person">
                                            <span><FiUser aria-hidden="true" /></span>
                                            <strong>{repair.HoTen}</strong>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="operations-apartment">
                                            <FiHome aria-hidden="true" />
                                            {repair.TenCanHo || '--'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="operations-issue">
                                            <strong>{repair.LoaiSuCo}</strong>
                                            <span>{repair.MoTa}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={`operations-status-select operations-status-select--${repair.TrangThai}`}>
                                            <i aria-hidden="true" />
                                            <select
                                                aria-label={`Trạng thái yêu cầu của ${repair.HoTen}`}
                                                value={repair.TrangThai}
                                                onChange={(event) => updateRepair(
                                                    repair.MaYeuCau,
                                                    event.target.value,
                                                )}
                                                disabled={updatingRepairId === repair.MaYeuCau}
                                            >
                                                {Object.entries(repairLabels).map(([value, label]) => (
                                                    <option key={value} value={value}>{label}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {loading && (
                        <div className="operations-table-state" aria-live="polite">
                            <span className="operations-loader" />
                            Đang tải yêu cầu...
                        </div>
                    )}

                    {!loading && repairs.length === 0 && (
                        <div className="operations-table-state">
                            <FiInbox aria-hidden="true" />
                            <strong>Chưa có yêu cầu sửa chữa</strong>
                            <span>Các yêu cầu mới từ người thuê sẽ xuất hiện tại đây.</span>
                        </div>
                    )}
                </div>
            </section>

            <section className="operations-billing-grid">
                <article className="operations-card operations-invoice-form-card">
                    <header className="operations-card-header">
                        <div className="operations-card-title">
                            <span className="operations-card-icon operations-card-icon--green">
                                <FiFileText aria-hidden="true" />
                            </span>
                            <div>
                                <span>Thu tiền</span>
                                <h2>Tạo hóa đơn</h2>
                            </div>
                        </div>
                    </header>

                    <form className="operations-invoice-form" onSubmit={createPayment}>
                        <label className="operations-field">
                            <span>Hợp đồng</span>
                            <div className="operations-input-wrap">
                                <FiHome aria-hidden="true" />
                                <select
                                    value={form.contractId}
                                    onChange={handleContractChange}
                                    required
                                >
                                    <option value="">Chọn hợp đồng</option>
                                    {contracts.map((contract) => (
                                        <option key={contract.MaHopDong} value={contract.MaHopDong}>
                                            {contract.TenCanHo} — {contract.HoTen}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </label>

                        <div className="operations-form-row">
                            <label className="operations-field">
                                <span>Kỳ thanh toán</span>
                                <div className="operations-input-wrap">
                                    <FiCalendar aria-hidden="true" />
                                    <input
                                        type="date"
                                        value={form.period}
                                        onChange={(event) => setForm({ ...form, period: event.target.value })}
                                        required
                                    />
                                </div>
                            </label>
                            <label className="operations-field">
                                <span>Hạn thanh toán</span>
                                <div className="operations-input-wrap">
                                    <FiClock aria-hidden="true" />
                                    <input
                                        type="date"
                                        value={form.dueDate}
                                        onChange={(event) => setForm({ ...form, dueDate: event.target.value })}
                                        required
                                    />
                                </div>
                            </label>
                        </div>

                        <label className="operations-field">
                            <span>Số tiền</span>
                            <div className="operations-input-wrap">
                                <FiDollarSign aria-hidden="true" />
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Nhập số tiền"
                                    value={form.amount}
                                    onChange={(event) => setForm({ ...form, amount: event.target.value })}
                                    required
                                />
                            </div>
                        </label>

                        <label className="operations-field">
                            <span>Ghi chú <small>(không bắt buộc)</small></span>
                            <textarea
                                rows="3"
                                placeholder="Nội dung gửi kèm hóa đơn..."
                                value={form.note}
                                onChange={(event) => setForm({ ...form, note: event.target.value })}
                            />
                        </label>

                        <button
                            className="operations-submit"
                            type="submit"
                            disabled={creatingPayment}
                        >
                            <FiCreditCard aria-hidden="true" />
                            {creatingPayment ? 'Đang tạo...' : 'Tạo hóa đơn'}
                        </button>
                    </form>
                </article>

                <article className="operations-card operations-payments-card">
                    <header className="operations-card-header">
                        <div className="operations-card-title">
                            <span className="operations-card-icon operations-card-icon--indigo">
                                <FiCreditCard aria-hidden="true" />
                            </span>
                            <div>
                                <span>Tài chính</span>
                                <h2>Danh sách hóa đơn</h2>
                            </div>
                        </div>
                        <span className="operations-count">{payments.length} hóa đơn</span>
                    </header>

                    <div className="operations-table-wrap operations-payment-table-wrap">
                        <table className="operations-table operations-payment-table">
                            <thead>
                                <tr>
                                    <th>Căn hộ</th>
                                    <th>Kỳ</th>
                                    <th>Hạn thanh toán</th>
                                    <th>Số tiền</th>
                                    <th>Trạng thái</th>
                                    <th aria-label="Thao tác" />
                                </tr>
                            </thead>
                            <tbody>
                                {!loading && payments.map((payment) => (
                                    <tr key={payment.MaHoaDon}>
                                        <td>
                                            <strong className="operations-payment-apartment">
                                                {payment.TenCanHo}
                                            </strong>
                                        </td>
                                        <td>
                                            {formatDate(payment.KyThanhToan, {
                                                month: '2-digit',
                                                year: 'numeric',
                                            })}
                                        </td>
                                        <td>{formatDate(payment.HanThanhToan)}</td>
                                        <td>
                                            <strong className="operations-money">
                                                {formatMoney(payment.SoTien)}
                                            </strong>
                                        </td>
                                        <td>
                                            <span className={`operations-payment-status operations-payment-status--${payment.TrangThai}`}>
                                                <i aria-hidden="true" />
                                                {paymentLabels[payment.TrangThai] || payment.TrangThai}
                                            </span>
                                        </td>
                                        <td>
                                            {payment.TrangThai !== 'DaThanhToan' && (
                                                <button
                                                    className="operations-paid-button"
                                                    type="button"
                                                    onClick={() => markPaid(payment.MaHoaDon)}
                                                    disabled={markingPaidId === payment.MaHoaDon}
                                                >
                                                    <FiCheckCircle aria-hidden="true" />
                                                    {markingPaidId === payment.MaHoaDon ? 'Đang lưu' : 'Đã thu'}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {loading && (
                            <div className="operations-table-state" aria-live="polite">
                                <span className="operations-loader" />
                                Đang tải hóa đơn...
                            </div>
                        )}

                        {!loading && payments.length === 0 && (
                            <div className="operations-table-state">
                                <FiInbox aria-hidden="true" />
                                <strong>Chưa có hóa đơn</strong>
                                <span>Hóa đơn mới tạo sẽ được hiển thị tại đây.</span>
                            </div>
                        )}
                    </div>
                </article>
            </section>
        </div>
    );
};

export default OwnerOperationsPage;
