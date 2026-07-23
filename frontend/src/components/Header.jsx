import '../styles/Header.css'
import { NavLink } from 'react-router-dom'
import { navigationItems } from './navigation'


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

            <div className="sidebar-account pt-3 border-top">
                <div className="text-muted small">
                    {user?.email} <br />
                    <span className="badge bg-info">{user?.role}</span>
                </div>
                <button
                    className="btn btn-sm btn-outline-danger w-100 mt-2"
                    onClick={handleLogout}>
                    Đăng xuất
                </button>
            </div>
        </aside>
    )
}

export default Header
