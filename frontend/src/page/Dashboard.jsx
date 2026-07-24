import { useEffect, useMemo, useState } from 'react';
import {
    Apartment,
    Buildings,
    Calendar,
    DoorOpen,
    Key,
    Wallet,
} from '@boxicons/react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    Title,
    Tooltip,
} from 'chart.js';
import { getCurrentUser } from '../services/authService';
import {
    getApartmentStatus,
    getRevenueByBuilding,
    getRevenueByMonth,
    getSummary,
} from '../services/dashboardService';
import '../styles/Dashboard.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

const formatCurrency = (value) => (
    `${Number(value || 0).toLocaleString('vi-VN')}đ`
);

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

    const monthChartData = useMemo(() => ({
        labels: revenueByMonth.length
            ? revenueByMonth.map((item) => item.month)
            : ['Không có dữ liệu'],
        datasets: [{
            label: 'Doanh thu',
            data: revenueByMonth.length
                ? revenueByMonth.map((item) => item.revenue)
                : [0],
            backgroundColor: '#6366f1',
            borderColor: '#4f46e5',
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 42,
        }],
    }), [revenueByMonth]);

    const statusChartData = useMemo(() => ({
        labels: ['Đã thuê', 'Còn trống'],
        datasets: [{
            data: [apartmentStatus.rented, apartmentStatus.empty],
            backgroundColor: ['#4f46e5', '#e8eaf2'],
            borderColor: ['#ffffff', '#ffffff'],
            borderWidth: 4,
            hoverBackgroundColor: ['#4338ca', '#d9dce8'],
            hoverOffset: 3,
        }],
    }), [apartmentStatus]);

    const buildingChartData = useMemo(() => ({
        labels: revenueByBuilding.length
            ? revenueByBuilding.map((item) => item.TenToaNha || item.tenToaNha)
            : ['Không có dữ liệu'],
        datasets: [{
            label: 'Doanh thu',
            data: revenueByBuilding.length
                ? revenueByBuilding.map((item) => item.revenue)
                : [0],
            backgroundColor: '#10b981',
            borderColor: '#059669',
            borderRadius: 8,
            borderSkipped: false,
            maxBarThickness: 54,
        }],
    }), [revenueByBuilding]);

    const barChartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                cornerRadius: 10,
                callbacks: {
                    label: (context) => ` ${formatCurrency(context.raw)}`,
                },
            },
        },
        scales: {
            x: {
                grid: { display: false },
                border: { display: false },
                ticks: {
                    color: '#7c8497',
                    font: { family: 'Poppins', size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                border: { display: false },
                grid: { color: '#eef0f5' },
                ticks: {
                    color: '#7c8497',
                    font: { family: 'Poppins', size: 11 },
                    callback: (value) => (
                        value >= 1000000
                            ? `${value / 1000000}tr`
                            : Number(value).toLocaleString('vi-VN')
                    ),
                },
            },
        },
    }), []);

    const doughnutOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        cutout: '74%',
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: '#111827',
                padding: 12,
                cornerRadius: 10,
            },
        },
    }), []);

    const totalStatusApartments = Number(apartmentStatus.rented || 0)
        + Number(apartmentStatus.empty || 0);
    const occupancyRate = totalStatusApartments
        ? Math.round((Number(apartmentStatus.rented || 0) / totalStatusApartments) * 100)
        : 0;

    const statisticCards = [
        {
            label: 'Tổng tòa nhà',
            value: summary.totalBuildings,
            note: 'Toàn hệ thống',
            icon: Buildings,
            tone: 'indigo',
        },
        {
            label: 'Tổng căn hộ',
            value: summary.totalApartments,
            note: 'Đang quản lý',
            icon: Apartment,
            tone: 'blue',
        },
        {
            label: 'Đang thuê',
            value: summary.rentedApartments,
            note: `${occupancyRate}% công suất`,
            icon: Key,
            tone: 'green',
        },
        {
            label: 'Còn trống',
            value: summary.emptyApartments,
            note: 'Sẵn sàng cho thuê',
            icon: DoorOpen,
            tone: 'orange',
        },
        {
            label: 'Doanh thu tháng',
            value: formatCurrency(summary.revenueThisMonth),
            note: 'Tổng thu hiện tại',
            icon: Wallet,
            tone: 'violet',
            featured: true,
        },
        {
            label: 'HĐ sắp hết hạn',
            value: summary.expiringContracts,
            note: 'Cần theo dõi',
            icon: Calendar,
            tone: 'red',
        },
    ];

    if (!isAdmin) {
        return (
            <div className="dashboard-access-denied" role="alert">
                <div className="dashboard-access-icon">!</div>
                <span>Quyền truy cập</span>
                <h2>Không thể mở Dashboard</h2>
                <p>Trang tổng quan chỉ dành cho tài khoản có quyền Admin.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="dashboard-loading" aria-live="polite">
                <div className="dashboard-loader" />
                <strong>Đang chuẩn bị dữ liệu</strong>
                <span>Vui lòng chờ trong giây lát...</span>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <section className="dashboard-stats" aria-label="Thống kê tổng quan">
                {statisticCards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <article
                            className={`dashboard-stat dashboard-stat--${card.tone}${card.featured ? ' dashboard-stat--featured' : ''}`}
                            key={card.label}
                        >
                            <div className="dashboard-stat-icon">
                                <Icon aria-hidden="true" />
                            </div>
                            <div className="dashboard-stat-content">
                                <span>{card.label}</span>
                                <strong>{card.value}</strong>
                                <small>{card.note}</small>
                            </div>
                        </article>
                    );
                })}
            </section>

            <section className="dashboard-charts">
                <article className="dashboard-panel dashboard-panel--revenue">
                    <div className="dashboard-panel-header">
                        <div>
                            <span>Doanh thu</span>
                            <h3>Doanh thu theo tháng</h3>
                        </div>
                        <div className="dashboard-legend dashboard-legend--indigo">
                            <i aria-hidden="true" />
                            VNĐ
                        </div>
                    </div>
                    <div className="dashboard-chart dashboard-chart--bar">
                        <Bar data={monthChartData} options={barChartOptions} />
                    </div>
                </article>

                <article className="dashboard-panel dashboard-panel--occupancy">
                    <div className="dashboard-panel-header">
                        <div>
                            <span>Công suất</span>
                            <h3>Tỷ lệ căn hộ</h3>
                        </div>
                    </div>
                    <div className="dashboard-doughnut">
                        <div className="dashboard-chart dashboard-chart--doughnut">
                            <Doughnut data={statusChartData} options={doughnutOptions} />
                            <div className="dashboard-doughnut-center">
                                <strong>{occupancyRate}%</strong>
                                <span>đã thuê</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-status-list">
                        <div>
                            <span><i className="is-rented" />Đã thuê</span>
                            <strong>{apartmentStatus.rented}</strong>
                        </div>
                        <div>
                            <span><i className="is-empty" />Còn trống</span>
                            <strong>{apartmentStatus.empty}</strong>
                        </div>
                    </div>
                </article>

                <article className="dashboard-panel dashboard-panel--building">
                    <div className="dashboard-panel-header">
                        <div>
                            <span>Hiệu suất</span>
                            <h3>Doanh thu theo tòa nhà</h3>
                        </div>
                        <div className="dashboard-legend dashboard-legend--green">
                            <i aria-hidden="true" />
                            VNĐ
                        </div>
                    </div>
                    <div className="dashboard-chart dashboard-chart--building">
                        <Bar data={buildingChartData} options={barChartOptions} />
                    </div>
                </article>
            </section>
        </div>
    );
};

export default Dashboard;
