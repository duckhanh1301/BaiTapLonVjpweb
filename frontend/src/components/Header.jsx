import { DoorOpen } from '@boxicons/react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'
import '../styles/Header.css'

function Header({ user, handleLogout }) {
    // Lọc menu theo role (nếu cần)
    const filteredItems = navigationItems.filter(item => {
        if (!item.roles) return true;
        return item.roles.includes(user?.role);
    });

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <h5>🏠 QL Nhà Trọ</h5>
                <small>Hệ thống quản lý</small>
            </div>

            <nav className="sidebar-nav">
                {filteredItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            isActive ? 'sidebar-link active' : 'sidebar-link'
                        }
                    >
                        <Icon className="sidebar-icon" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-account">
                <div className="sidebar-profile">
                    <div className="sidebar-profile-info">
                        <span className="sidebar-profile-label">Tài khoản</span>
                        <strong title={user?.email}>
                            {user?.email || 'Chưa cập nhật email'}
                        </strong>
                    </div>
                </div>

                <div className="sidebar-account-status">
                    <span
                        className={`sidebar-role${user?.role === 'Admin' ? ' is-admin' : ''}`}
                    >
                        <i aria-hidden="true" />
                        {user?.role || 'Thành viên'}
                    </span>
                    <small>Đang hoạt động</small>
                </div>

                <button
                    className="sidebar-logout"
                    type="button"
                    onClick={handleLogout}
                >
                    <DoorOpen aria-hidden="true" />
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>
    );
}

export default Header;
