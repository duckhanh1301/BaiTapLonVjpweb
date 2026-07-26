import { useState } from 'react';
import axiosConfig from '../services/axiosConfig';
import { toast } from 'react-toastify';
import '../styles/ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleTogglePassword = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.oldPassword || !formData.newPassword || !formData.confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            toast.error('Mật khẩu mới không trùng khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (formData.oldPassword === formData.newPassword) {
            toast.error('Mật khẩu mới phải khác mật khẩu cũ');
            return;
        }

        try {
            setLoading(true);
            const response = await axiosConfig.post('/api/auth/change-password', {
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            }
        } catch (error) {
            console.error('Lỗi:', error);
            if (error.response?.status === 401) {
                toast.error('Mật khẩu cũ không đúng');
            } else {
                toast.error('Đổi mật khẩu thất bại. Vui lòng thử lại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="change-password-page">
            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-5">
                        <h1 className="mb-4 text-center">Đổi Mật Khẩu</h1>

                        <div className="card password-card">
                            <div className="card-body">
                                <form onSubmit={handleSubmit}>
                                    {/* Old Password */}
                                    <div className="mb-3">
                                        <label htmlFor="oldPassword" className="form-label">
                                            Mật khẩu cũ
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.old ? "text" : "password"}
                                                className="form-control"
                                                id="oldPassword"
                                                name="oldPassword"
                                                value={formData.oldPassword}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mật khẩu cũ"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleTogglePassword('old')}
                                            >
                                                <i className={`bi bi-eye${showPassword.old ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* New Password */}
                                    <div className="mb-3">
                                        <label htmlFor="newPassword" className="form-label">
                                            Mật khẩu mới
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                className="form-control"
                                                id="newPassword"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleTogglePassword('new')}
                                            >
                                                <i className={`bi bi-eye${showPassword.new ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                        <small className="text-muted d-block mt-1">
                                            Mật khẩu phải có ít nhất 6 ký tự
                                        </small>
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="mb-4">
                                        <label htmlFor="confirmPassword" className="form-label">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                className="form-control"
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                placeholder="Nhập lại mật khẩu mới"
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => handleTogglePassword('confirm')}
                                            >
                                                <i className={`bi bi-eye${showPassword.confirm ? '-slash' : ''}`}></i>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="btn btn-primary w-100 mb-2"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            'Đổi mật khẩu'
                                        )}
                                    </button>

                                    <div className="alert alert-info mt-3" role="alert">
                                        <i className="bi bi-info-circle"></i>
                                        <strong> Lưu ý:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Mật khẩu mới phải khác mật khẩu cũ</li>
                                            <li>Sử dụng mật khẩu mạnh để bảo vệ tài khoản</li>
                                            <li>Không chia sẻ mật khẩu với người khác</li>
                                        </ul>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
