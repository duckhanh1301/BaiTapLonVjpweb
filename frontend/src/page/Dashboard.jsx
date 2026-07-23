
import { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/authService';
import { getSummary, getRevenueByMonth, getApartmentStatus, getRevenueByBuilding } from '../services/dashboardService';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Đăng ký các thành phần Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Dashboard = () => {
    const user = getCurrentUser();
    const isAdmin = user?.role === 'Admin';

    const [summary, setSummary] = useState({
        totalBuildings: 0,
        totalApartments: 0,
        rentedApartments: 0,
        emptyApartments: 0,
        revenueThisMonth: 0,
        expiringContracts: 0,
    });
    const [revenueByMonth, setRevenueByMonth] = useState([]);
    const [apartmentStatus, setApartmentStatus] = useState({ rented: 0, empty: 0 });
    const [revenueByBuilding, setRevenueByBuilding] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAdmin) {
            return;
        }

        const fetchAllData = async () => {
            try {
                const [summaryData, monthData, statusData, buildingData] = await Promise.all([
                    getSummary(),
                    getRevenueByMonth(),
                    getApartmentStatus(),
                    getRevenueByBuilding(),
                ]);
                setSummary(summaryData);
                setRevenueByMonth(monthData);
                setApartmentStatus(statusData);
                setRevenueByBuilding(buildingData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu dashboard:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllData();
    }, [isAdmin]);

    // Nếu không phải Admin, hiển thị thông báo
    if (!isAdmin) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>⚠️ Truy cập bị từ chối</h4>
                    <p>Bạn không có quyền xem trang Dashboard. Chỉ Admin mới có quyền truy cập.</p>
                </div>
            </div>
        );
    }

    // Dữ liệu cho biểu đồ doanh thu theo tháng
    const monthLabels = revenueByMonth.map(item => item.month);
    const monthData = revenueByMonth.map(item => item.revenue);

    const monthChartData = {
        labels: monthLabels.length ? monthLabels : ['Không có dữ liệu'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: monthData.length ? monthData : [0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            },
        ],
    };

    // Dữ liệu cho biểu đồ tỷ lệ căn hộ
    const statusChartData = {
        labels: ['Đã thuê', 'Trống'],
        datasets: [
            {
                data: [apartmentStatus.rented, apartmentStatus.empty],
                backgroundColor: ['#36A2EB', '#FF6384'],
                hoverBackgroundColor: ['#36A2EB', '#FF6384'],
            },
        ],
    };

    // Dữ liệu cho biểu đồ doanh thu theo tòa nhà
    const buildingLabels = revenueByBuilding.map(item => item.TenToaNha || item.tenToaNha);
    const buildingData = revenueByBuilding.map(item => item.revenue);

    const buildingChartData = {
        labels: buildingLabels.length ? buildingLabels : ['Không có dữ liệu'],
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: buildingData.length ? buildingData : [0],
                backgroundColor: 'rgba(255, 159, 64, 0.6)',
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1,
            },
        ],
    };

    if (loading) {
        return <div className="text-center mt-5"><div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div></div>;
    }

    return (
        <div>
            {/* 6 card thống kê */}
            <div className="row">
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-primary">
                        <div className="card-body">
                            <h6 className="card-title">🏢 Tổng tòa nhà</h6>
                            <h3>{summary.totalBuildings}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-success">
                        <div className="card-body">
                            <h6 className="card-title">🏠 Tổng căn hộ</h6>
                            <h3>{summary.totalApartments}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-warning">
                        <div className="card-body">
                            <h6 className="card-title">🔑 Đang thuê</h6>
                            <h3>{summary.rentedApartments}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-danger">
                        <div className="card-body">
                            <h6 className="card-title">🔄 Trống</h6>
                            <h3>{summary.emptyApartments}</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-info">
                        <div className="card-body">
                            <h6 className="card-title">💰 Doanh thu tháng</h6>
                            <h3>{summary.revenueThisMonth.toLocaleString()}đ</h3>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-sm-6 mb-3">
                    <div className="card text-white bg-secondary">
                        <div className="card-body">
                            <h6 className="card-title">📄 HĐ sắp hết hạn</h6>
                            <h3>{summary.expiringContracts}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3 biểu đồ */}
            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">📈 Doanh thu theo tháng</div>
                        <div className="card-body">
                            <Bar data={monthChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
                <div className="col-md-6 mb-4">
                    <div className="card">
                        <div className="card-header">🥧 Tỷ lệ căn hộ</div>
                        <div className="card-body d-flex justify-content-center">
                            <div style={{ width: '250px' }}>
                                <Doughnut data={statusChartData} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mb-4">
                    <div className="card">
                        <div className="card-header">🏢 Doanh thu theo tòa nhà</div>
                        <div className="card-body">
                            <Bar data={buildingChartData} options={{ responsive: true }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
