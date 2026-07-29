// import { useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
// import { createRepair, getRepairs } from '../services/repairService';
// import '../styles/RepairRequestPage.css';

// const labels = { ChoXuLy: 'Chờ xử lý', DangXuLy: 'Đang xử lý', HoanThanh: 'Hoàn thành', TuChoi: 'Từ chối' };
// const RepairRequestPage = () => {
//     const [form, setForm] = useState({ repairType: '', description: '', urgentLevel: 'BinhThuong' });
//     const [items, setItems] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const load = async () => { try { setItems(await getRepairs()); } catch { toast.error('Không thể tải yêu cầu sửa chữa.'); } };
//     useEffect(() => { load(); }, []);
//     const submit = async (event) => { event.preventDefault(); if (!form.repairType || !form.description.trim()) return toast.error('Vui lòng nhập loại sự cố và mô tả.'); try { setLoading(true); await createRepair(form); setForm({ repairType: '', description: '', urgentLevel: 'BinhThuong' }); toast.success('Đã gửi yêu cầu sửa chữa.'); load(); } catch (error) { toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại.'); } finally { setLoading(false); } };
//     return <div className="repair-request-page"><div className="container py-4"><h1 className="mb-4">Yêu cầu sửa chữa</h1><div className="row"><div className="col-md-6 mb-4"><div className="card repair-form-card"><div className="card-header bg-primary text-white"><h5 className="mb-0">Gửi yêu cầu</h5></div><div className="card-body"><form onSubmit={submit}><label className="form-label">Loại sự cố</label><input className="form-control mb-3" value={form.repairType} onChange={e => setForm({ ...form, repairType: e.target.value })} placeholder="Ví dụ: Điều hòa hỏng" required /><label className="form-label">Mô tả</label><textarea className="form-control mb-3" rows="4" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required /><label className="form-label">Mức độ ưu tiên</label><select className="form-select mb-3" value={form.urgentLevel} onChange={e => setForm({ ...form, urgentLevel: e.target.value })}><option value="BinhThuong">Bình thường</option><option value="KhanCap">Khẩn cấp</option><option value="RatKhanCap">Rất khẩn cấp</option></select><button className="btn btn-primary w-100" disabled={loading}>{loading ? 'Đang gửi...' : 'Gửi yêu cầu'}</button></form></div></div></div><div className="col-md-6"><div className="card"><div className="card-header"><h5 className="mb-0">Lịch sử yêu cầu</h5></div><div className="card-body">{items.length ? items.map(x => <div key={x.MaYeuCau} className="border-bottom pb-3 mb-3"><div className="d-flex justify-content-between"><strong>{x.LoaiSuCo}</strong><span className="badge bg-secondary">{labels[x.TrangThai]}</span></div><p className="mb-1 mt-2">{x.MoTa}</p><small className="text-muted">{new Date(x.NgayTao).toLocaleString('vi-VN')}</small>{x.GhiChuXuLy && <p className="mb-0 mt-2 text-info">Phản hồi: {x.GhiChuXuLy}</p>}</div>) : <p className="text-muted mb-0">Chưa có yêu cầu nào.</p>}</div></div></div></div></div></div>;
// };
// export default RepairRequestPage;
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
    FaClock,
    FaClockRotateLeft,
    FaHouse,
    FaMessage,
    FaPaperPlane,
    FaScrewdriverWrench,
    FaTriangleExclamation,
} from 'react-icons/fa6';
import { createRepair, getRepairs } from '../services/repairService';
import '../styles/RepairRequestPage.css';

const statusLabels = {
    ChoXuLy: 'Chờ xử lý',
    DangXuLy: 'Đang xử lý',
    HoanThanh: 'Hoàn thành',
    TuChoi: 'Từ chối',
};

const priorityLabels = {
    BinhThuong: 'Bình thường',
    KhanCap: 'Khẩn cấp',
    RatKhanCap: 'Rất khẩn cấp',
};

const RepairRequestPage = () => {
    const [form, setForm] = useState({
        repairType: '',
        description: '',
        urgentLevel: 'BinhThuong',
    });
    const [items, setItems] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [loadingItems, setLoadingItems] = useState(true);

    const loadRepairs = async () => {
        try {
            const data = await getRepairs();
            setItems(Array.isArray(data) ? data : []);
        } catch {
            toast.error('Không thể tải yêu cầu sửa chữa.');
        } finally {
            setLoadingItems(false);
        }
    };

    useEffect(() => {
        let active = true;

        getRepairs()
            .then((data) => {
                if (active) setItems(Array.isArray(data) ? data : []);
            })
            .catch(() => toast.error('Không thể tải yêu cầu sửa chữa.'))
            .finally(() => {
                if (active) setLoadingItems(false);
            });

        return () => {
            active = false;
        };
    }, []);

    const submit = async (event) => {
        event.preventDefault();
        if (!form.repairType.trim() || !form.description.trim()) {
            toast.error('Vui lòng nhập loại sự cố và mô tả.');
            return;
        }

        try {
            setSubmitting(true);
            await createRepair(form);
            setForm({ repairType: '', description: '', urgentLevel: 'BinhThuong' });
            toast.success('Đã gửi yêu cầu sửa chữa.');
            await loadRepairs();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Gửi yêu cầu thất bại.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="repair-request-page">
            <div className="repair-page-container">
                <header className="repair-page-header">
                    <div>
                        <span className="repair-eyebrow">Hỗ trợ căn hộ</span>
                        <h1>Yêu cầu sửa chữa</h1>
                        <p>Thông báo sự cố và theo dõi tiến độ xử lý từ ban quản lý.</p>
                    </div>
                    <div className="repair-header-icon" aria-hidden="true">
                        <FaScrewdriverWrench />
                    </div>
                </header>

                <div className="repair-layout">
                    <section className="repair-form-card">
                        <div className="repair-card-heading">
                            <span className="repair-heading-icon"><FaPaperPlane aria-hidden="true" /></span>
                            <div>
                                <span>Tạo yêu cầu mới</span>
                                <h2>Thông tin sự cố</h2>
                            </div>
                        </div>

                        <form className="repair-form" onSubmit={submit}>
                            <label htmlFor="repair-type">Loại sự cố</label>
                            <div className="repair-input-shell">
                                <FaScrewdriverWrench aria-hidden="true" />
                                <input
                                    id="repair-type"
                                    value={form.repairType}
                                    onChange={(event) => setForm({ ...form, repairType: event.target.value })}
                                    placeholder="Ví dụ: Điều hòa không hoạt động"
                                    required
                                />
                            </div>

                            <label htmlFor="repair-description">Mô tả chi tiết</label>
                            <textarea
                                id="repair-description"
                                rows="5"
                                value={form.description}
                                onChange={(event) => setForm({ ...form, description: event.target.value })}
                                placeholder="Mô tả vị trí, tình trạng và thời điểm xảy ra sự cố..."
                                required
                            />
                            <small>Cung cấp càng nhiều chi tiết sẽ giúp sự cố được xử lý nhanh hơn.</small>

                            <label htmlFor="repair-priority">Mức độ ưu tiên</label>
                            <select
                                id="repair-priority"
                                value={form.urgentLevel}
                                onChange={(event) => setForm({ ...form, urgentLevel: event.target.value })}
                            >
                                <option value="BinhThuong">Bình thường</option>
                                <option value="KhanCap">Khẩn cấp</option>
                                <option value="RatKhanCap">Rất khẩn cấp</option>
                            </select>

                            <div className="repair-priority-note">
                                <FaTriangleExclamation aria-hidden="true" />
                                <p><strong>Lưu ý:</strong> Chỉ chọn khẩn cấp khi sự cố ảnh hưởng đến an toàn hoặc sinh hoạt thiết yếu.</p>
                            </div>

                            <button type="submit" className="repair-submit-button" disabled={submitting}>
                                <FaPaperPlane aria-hidden="true" />
                                {submitting ? 'Đang gửi yêu cầu...' : 'Gửi yêu cầu sửa chữa'}
                            </button>
                        </form>
                    </section>

                    <section className="repair-history-card">
                        <div className="repair-card-heading repair-history-heading">
                            <span className="repair-heading-icon"><FaClockRotateLeft aria-hidden="true" /></span>
                            <div>
                                <span>Theo dõi tiến độ</span>
                                <h2>Lịch sử yêu cầu</h2>
                            </div>
                            <strong>{items.length}</strong>
                        </div>

                        <div className="repair-history-list">
                            {loadingItems ? (
                                <div className="repair-empty-state" role="status">
                                    <span className="repair-spinner" aria-hidden="true" />
                                    <p>Đang tải yêu cầu...</p>
                                </div>
                            ) : items.length ? (
                                items.map((item) => (
                                    <article key={item.MaYeuCau} className="repair-history-item">
                                        <div className="repair-item-top">
                                            <div>
                                                <span className="repair-item-icon"><FaHouse aria-hidden="true" /></span>
                                                <div>
                                                    <span>{item.TenCanHo || `Yêu cầu #${item.MaYeuCau}`}</span>
                                                    <h3>{item.LoaiSuCo}</h3>
                                                </div>
                                            </div>
                                            <span className={`repair-status is-${item.TrangThai || 'unknown'}`}>
                                                <i aria-hidden="true" />
                                                {statusLabels[item.TrangThai] || item.TrangThai || 'Chưa cập nhật'}
                                            </span>
                                        </div>

                                        <p className="repair-description">{item.MoTa}</p>

                                        <div className="repair-item-meta">
                                            <span><FaClock aria-hidden="true" /> {new Date(item.NgayTao).toLocaleString('vi-VN')}</span>
                                            <span className={`repair-priority is-${item.MucDoUuTien || 'BinhThuong'}`}>
                                                {priorityLabels[item.MucDoUuTien] || 'Bình thường'}
                                            </span>
                                        </div>

                                        {item.GhiChuXuLy && (
                                            <div className="repair-response">
                                                <FaMessage aria-hidden="true" />
                                                <p><strong>Phản hồi từ quản lý</strong>{item.GhiChuXuLy}</p>
                                            </div>
                                        )}
                                    </article>
                                ))
                            ) : (
                                <div className="repair-empty-state">
                                    <FaClockRotateLeft aria-hidden="true" />
                                    <strong>Chưa có yêu cầu nào</strong>
                                    <p>Các yêu cầu bạn gửi sẽ được lưu tại đây.</p>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RepairRequestPage;
