<<<<<<< Updated upstream
import { DoorOpen } from '@boxicons/react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'
import '../styles/Header.css'
=======
// // frontend/src/components/Header.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { navigationItems } from './navigation';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import '../styles/Header.css';
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
            <div className="sidebar-account">
                <div className="sidebar-profile">
                    <div className="sidebar-profile-info">
                        <span className="sidebar-profile-label">Tài khoản</span>
                        <strong title={user?.email}>
                            {user?.email || 'Chưa cập nhật email'}
                        </strong>
=======
            <div className="sidebar-footer">
                <div className="sidebar-user">
                    <FaUserCircle size={36} className="text-white-50" />
                    <div className="ms-2 text-truncate">
                        <div className="text-white small fw-bold">{user?.email || 'User'}</div>
                        <span className="badge bg-info">{user?.role || 'Nhân viên'}</span>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                    className="sidebar-logout"
                    type="button"
                    onClick={handleLogout}
                >
                    <DoorOpen aria-hidden="true" />
                    <span>Đăng xuất</span>
=======
                    className="btn btn-outline-danger btn-sm w-100 mt-3"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="me-2" />
                    Đăng xuất
>>>>>>> Stashed changes
                </button>
            </div>
        </aside>
    );
}

export default Header;
