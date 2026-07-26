import { useEffect, useState } from 'react';
import { getAllTenants, updateTenant } from '../services/tenantService';
import { getCurrentUser } from '../services/authService';
import { toast } from 'react-toastify';
import '../styles/UserProfilePage.css';

const UserProfilePage = () => {
    const user = getCurrentUser();
    const [tenant, setTenant] = useState(null);
    const [formData, setFormData] = useState({
        HoTen: '',
        SoDienThoai: '',
        Email: '',
        CCCD: '',
        NgaySinh: '',
        DiaChi: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchTenantInfo();
    }, []);

    const fetchTenantInfo = async () => {
        try {
            setLoading(true);
            const data = await getAllTenants();
            if (data && data.length > 0) {
                setTenant(data[0]);
                setFormData({
                    HoTen: data[0].HoTen || '',
                    SoDienThoai: data[0].SoDienThoai || '',
                    Email: data[0].Email || '',
                    CCCD: data[0].CCCD || '',
                    NgaySinh: data[0].NgaySinh || '',
                    DiaChi: data[0].DiaChi || ''
                });
            }
        } catch (error) {
            console.error('Lỗi khi lấy thông tin:', error);
            toast.error('Không thể lấy thông tin cá nhân');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (tenant) {
                // Only update phone and email as per requirements
                const updateData = {
                    HoTen: formData.HoTen,
                    SoDienThoai: formData.SoDienThoai,
                    Email: formData.Email,
                    CCCD: formData.CCCD,
                    NgaySinh: formData.NgaySinh,
                    DiaChi: formData.DiaChi
                };
                await updateTenant(tenant.MaNguoiThue, updateData);
                setTenant(prev => ({ ...prev, ...updateData }));
                setIsEditing(false);
                toast.success('Cập nhật thông tin thành công');
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật:', error);
            toast.error('Cập nhật thông tin thất bại');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Đang tải...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            <div className="container py-4">
                <h1 className="mb-4">Thông Tin Cá Nhân</h1>

                {tenant && (
                    <div className="card profile-card">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">Hồ Sơ Của Tôi</h5>
                        </div>
                        <div className="card-body">
                            {!isEditing ? (
                                <div className="profile-info">
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Họ tên:</strong> {formData.HoTen}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>CCCD:</strong> {formData.CCCD}</p>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Số điện thoại:</strong> {formData.SoDienThoai}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Email:</strong> {formData.Email}</p>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <p><strong>Ngày sinh:</strong> {formData.NgaySinh ? new Date(formData.NgaySinh).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <p><strong>Địa chỉ:</strong> {formData.DiaChi || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="btn btn-primary"
                                    >
                                        <i className="bi bi-pencil"></i> Chỉnh sửa
                                    </button>
                                </div>
                            ) : (
                                <form>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Họ tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="HoTen"
                                                value={formData.HoTen}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            <small className="text-muted">Không thể chỉnh sửa</small>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">CCCD</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="CCCD"
                                                value={formData.CCCD}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                            <small className="text-muted">Không thể chỉnh sửa</small>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Số điện thoại</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="SoDienThoai"
                                                value={formData.SoDienThoai}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="Email"
                                                value={formData.Email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">Ngày sinh</label>
                                            <input
                                                type="date"
                                                className="form-control"
                                                name="NgaySinh"
                                                value={formData.NgaySinh ? formData.NgaySinh.split(' ')[0] : ''}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">Địa chỉ</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="DiaChi"
                                                value={formData.DiaChi}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            disabled={saving}
                                            className="btn btn-success me-2"
                                        >
                                            {saving ? 'Đang lưu...' : 'Lưu'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setFormData({
                                                    HoTen: tenant.HoTen || '',
                                                    SoDienThoai: tenant.SoDienThoai || '',
                                                    Email: tenant.Email || '',
                                                    CCCD: tenant.CCCD || '',
                                                    NgaySinh: tenant.NgaySinh || '',
                                                    DiaChi: tenant.DiaChi || ''
                                                });
                                            }}
                                            className="btn btn-secondary"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
