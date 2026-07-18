import '../styles/Header.css'
import { Dashboard, Apartment, Cog, Pin, ChartTrend, UserCircle } from '@boxicons/react';
import { Link } from 'react-router-dom'


function Header() {
    return (
        <div className="parent">
            <div className="slidebar">
                <nav>
                    <Link to="/">
                        <Dashboard />
                        <span>
                            Dashboard
                        </span>
                    </Link>
                    <Link to="/">
                        <span>
                            <Apartment />
                            Căn Hộ
                        </span>
                    </Link>
                    <Link to="/">
                        <span>
                            <Cog />
                            Dịch Vụ
                        </span>
                    </Link>
                    <Link to="/">
                        <span>
                            <Pin />
                            Tình Trạng
                        </span>
                    </Link>
                    <Link to="/">
                        <span>
                            <ChartTrend />
                            Thống Kê
                        </span>
                    </Link>
                    <Link to="/">
                        <UserCircle />
                        <span>
                            Cá Nhân
                        </span>
                    </Link>
                </nav>
            </div>
            <div className="header">
                <div className="header-content">
                    <h1>
                        Quản Lý Toà Nhà Cho Thuê
                    </h1>
                </div>
            </div>
        </div>
    )
}

export default Header
