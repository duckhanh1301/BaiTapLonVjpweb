import { DoorOpen } from '@boxicons/react'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'
import '../styles/Header.css'

function Header({ user, handleLogout }) {
    return (
        <aside className="slidebar">
            <nav>
                {navigationItems.map(({ path, label, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => isActive ? 'active' : ''}
                    >
                        <Icon aria-hidden="true" />
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
    )
}

export default Header
