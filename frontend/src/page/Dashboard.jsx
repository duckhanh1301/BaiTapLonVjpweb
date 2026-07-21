// // frontend/src/pages/Dashboard.jsx
// import { getCurrentUser } from '../services/authService';

// const Dashboard = () => {
//     const user = getCurrentUser();

//     return (
//         <div>
//             <h2>📊 Dashboard</h2>
//             <div className="card mt-3">
//                 <div className="card-body">
//                     <h5 className="card-title">Xin chào, {user?.email}</h5>
//                     <p className="card-text">Vai trò: <strong>{user?.role}</strong></p>
//                     <p className="card-text">Đây là trang Dashboard. Sẽ có thống kê và biểu đồ ở các ngày sau.</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Dashboard;
import { useEffect, useState } from 'react';
import { getSummary } from '../services/dashboardService';
import { getCurrentUser } from '../services/authService';

const Dashboard = () => {
    const user = getCurrentUser();
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getSummary();
                setSummary(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Dashboard</h2>
            <div className="row">
                <div className="col-md-3">Tổng tòa nhà: {summary.totalBuildings}</div>
                <div className="col-md-3">Tổng căn hộ: {summary.totalApartments}</div>
                <div className="col-md-3">Đang thuê: {summary.rentedApartments}</div>
                <div className="col-md-3">Trống: {summary.emptyApartments}</div>
                <div className="col-md-3">Doanh thu tháng: {summary.revenueThisMonth}</div>
                <div className="col-md-3">Hợp đồng sắp hết hạn: {summary.expiringContracts}</div>
            </div>
        </div>
    );
};
export default Dashboard;