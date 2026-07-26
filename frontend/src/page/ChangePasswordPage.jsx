import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    FaCheck,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaLock,
    FaShieldAlt,
} from 'react-icons/fa';
import axiosConfig from '../services/axiosConfig';
import '../styles/ChangePasswordPage.css';

const ChangePasswordPage = () => {
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState({
        old: false,
        new: false,
        confirm: false,
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleTogglePassword = (field) => {
        setShowPassword((previous) => ({
            ...previous,
            [field]: !previous[field],
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

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
            const response = await axiosConfig.post('/auth/change-password', formData);

            if (response.status === 200) {
                toast.success('Đổi mật khẩu thành công');
                setFormData({
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                });
                setShowPassword({ old: false, new: false, confirm: false });
            }
        } catch (error) {
            console.error('Lỗi:', error);
            const message = error.response?.data?.message;

            if (error.response?.status === 401) {
                toast.error('Mật khẩu cũ không đúng');
            } else {
                toast.error(message || 'Đổi mật khẩu thất bại. Vui lòng thử lại');
            }
        } finally {
            setLoading(false);
        }
    };

    const passwordChecks = [
        formData.newPassword.length >= 6,
        /[A-Za-z]/.test(formData.newPassword) && /[0-9]/.test(formData.newPassword),
        /[^A-Za-z0-9]/.test(formData.newPassword),
    ];
    const strength = passwordChecks.filter(Boolean).length;
    const strengthLabels = ['Chưa nhập', 'Yếu', 'Khá', 'Mạnh'];
    const passwordsMatch = (
        formData.confirmPassword.length > 0
        && formData.newPassword === formData.confirmPassword
    );

    const renderPasswordField = ({
        id,
        name,
        label,
        placeholder,
        visibilityKey,
        autoComplete,
    }) => (
        <label className="cp-field" htmlFor={id}>
            <span className="cp-field-label">{label}</span>
            <div className="cp-input-shell">
                <FaLock className="cp-input-icon" aria-hidden="true" />
                <input
                    id={id}
                    name={name}
                    type={showPassword[visibilityKey] ? 'text' : 'password'}
                    value={formData[name]}
                    onChange={handleInputChange}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    disabled={loading}
                />
                <button
                    type="button"
                    className="cp-visibility-button"
                    onClick={() => handleTogglePassword(visibilityKey)}
                    aria-label={showPassword[visibilityKey] ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    disabled={loading}
                >
                    {showPassword[visibilityKey]
                        ? <FaEyeSlash aria-hidden="true" />
                        : <FaEye aria-hidden="true" />}
                </button>
            </div>
        </label>
    );

    return (
        <div className="change-password-page">
            <div className="cp-shell">
                <aside className="cp-security-panel">
                    <div>
                        <span className="cp-security-icon">
                            <FaShieldAlt aria-hidden="true" />
                        </span>
                        <span className="cp-eyebrow">Bảo mật tài khoản</span>
                        <h1>Mật khẩu an toàn, tài khoản vững chắc</h1>
                        <p>
                            Cập nhật mật khẩu định kỳ giúp bảo vệ thông tin cá nhân
                            và dữ liệu của bạn tốt hơn.
                        </p>
                    </div>

                    <div className="cp-security-tips">
                        <div>
                            <span><FaCheck aria-hidden="true" /></span>
                            <p><strong>Tối thiểu 6 ký tự</strong>Độ dài đủ để tăng tính bảo mật.</p>
                        </div>
                        <div>
                            <span><FaCheck aria-hidden="true" /></span>
                            <p><strong>Không dùng mật khẩu cũ</strong>Tạo một mật khẩu hoàn toàn mới.</p>
                        </div>
                        <div>
                            <span><FaCheck aria-hidden="true" /></span>
                            <p><strong>Giữ mật khẩu riêng tư</strong>Không chia sẻ cho bất kỳ ai.</p>
                        </div>
                    </div>

                    <div className="cp-security-note">
                        <FaLock aria-hidden="true" />
                        <span>Thông tin của bạn được bảo vệ an toàn</span>
                    </div>
                </aside>

                <section className="cp-form-panel">
                    <header className="cp-form-header">
                        <span className="cp-form-icon"><FaKey aria-hidden="true" /></span>
                        <div>
                            <span>Cài đặt bảo mật</span>
                            <h2>Đổi mật khẩu</h2>
                            <p>Nhập mật khẩu hiện tại và thiết lập mật khẩu mới.</p>
                        </div>
                    </header>

                    <form className="cp-form" onSubmit={handleSubmit}>
                        {renderPasswordField({
                            id: 'oldPassword',
                            name: 'oldPassword',
                            label: 'Mật khẩu hiện tại',
                            placeholder: 'Nhập mật khẩu hiện tại',
                            visibilityKey: 'old',
                            autoComplete: 'current-password',
                        })}

                        <div className="cp-form-divider" />

                        {renderPasswordField({
                            id: 'newPassword',
                            name: 'newPassword',
                            label: 'Mật khẩu mới',
                            placeholder: 'Nhập mật khẩu mới',
                            visibilityKey: 'new',
                            autoComplete: 'new-password',
                        })}

                        <div className={`cp-strength is-${strength}`}>
                            <div className="cp-strength-label">
                                <span>Độ mạnh mật khẩu</span>
                                <strong>{strengthLabels[strength]}</strong>
                            </div>
                            <div className="cp-strength-bars" aria-hidden="true">
                                <i /><i /><i />
                            </div>
                            <small>Nên kết hợp chữ, số và ký tự đặc biệt.</small>
                        </div>

                        {renderPasswordField({
                            id: 'confirmPassword',
                            name: 'confirmPassword',
                            label: 'Xác nhận mật khẩu mới',
                            placeholder: 'Nhập lại mật khẩu mới',
                            visibilityKey: 'confirm',
                            autoComplete: 'new-password',
                        })}

                        {formData.confirmPassword && (
                            <p className={`cp-match-message ${passwordsMatch ? 'is-match' : 'is-mismatch'}`}>
                                <span aria-hidden="true">{passwordsMatch ? '✓' : '!'}</span>
                                {passwordsMatch
                                    ? 'Mật khẩu xác nhận đã trùng khớp.'
                                    : 'Mật khẩu xác nhận chưa trùng khớp.'}
                            </p>
                        )}

                        <button className="cp-submit-button" type="submit" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="cp-spinner" aria-hidden="true" />
                                    Đang cập nhật...
                                </>
                            ) : (
                                <>
                                    <FaKey aria-hidden="true" />
                                    Cập nhật mật khẩu
                                </>
                            )}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};

export default ChangePasswordPage;
