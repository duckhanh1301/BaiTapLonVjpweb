import { useState } from 'react';
import '../styles/NotificationsPage.css';

// Mock notifications
const mockNotifications = [
    {
        id: 1,
        type: 'payment',
        title: 'Tiền nhà tháng 8',
        message: 'Hạn thanh toán tiền nhà tháng 8 là ngày 01/08/2026',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        icon: 'bi-credit-card'
    },
    {
        id: 2,
        type: 'contract',
        title: 'Hợp đồng sắp hết hạn',
        message: 'Hợp đồng thuê căn hộ A101 sẽ hết hạn vào ngày 15/09/2026. Vui lòng liên hệ admin để gia hạn.',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: false,
        icon: 'bi-file-earmark-contract'
    },
    {
        id: 3,
        type: 'notification',
        title: 'Thông báo mất điện',
        message: 'Tòa A sẽ mất điện vào ngày 10/08/2026 từ 8:00 đến 12:00 để bảo trì hệ thống.',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        icon: 'bi-exclamation-triangle'
    },
    {
        id: 4,
        type: 'repair',
        title: 'Yêu cầu sửa chữa được chấp nhận',
        message: 'Yêu cầu sửa chữa điều hòa của bạn đã được chấp nhận. Kỹ thuật viên sẽ tới vào ngày 09/08/2026 lúc 10:00.',
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        icon: 'bi-tools'
    },
    {
        id: 5,
        type: 'payment',
        title: 'Xác nhận thanh toán',
        message: 'Thanh toán tiền nhà tháng 7/2026 đã được xác nhận. Cảm ơn bạn!',
        date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
        icon: 'bi-check-circle'
    }
];

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState(mockNotifications);
    const [filterType, setFilterType] = useState('');
    const [showOnlyUnread, setShowOnlyUnread] = useState(false);

    const filteredNotifications = notifications.filter(notif => {
        if (filterType && notif.type !== filterType) return false;
        if (showOnlyUnread && notif.isRead) return false;
        return true;
    });

    const getNotificationColor = (type) => {
        const colorMap = {
            'payment': 'border-start border-success',
            'contract': 'border-start border-info',
            'notification': 'border-start border-warning',
            'repair': 'border-start border-danger'
        };
        return colorMap[type] || 'border-start border-secondary';
    };

    const getTypeLabel = (type) => {
        const labelMap = {
            'payment': 'Thanh Toán',
            'contract': 'Hợp Đồng',
            'notification': 'Thông Báo',
            'repair': 'Sửa Chữa'
        };
        return labelMap[type] || 'Khác';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        if (date.toDateString() === today.toDateString()) {
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Hôm qua';
        } else {
            return date.toLocaleDateString('vi-VN');
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, isRead: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <div className="notifications-page">
            <div className="container py-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h1>Thông Báo {unreadCount > 0 && <span className="badge bg-danger">{unreadCount}</span>}</h1>
                    {unreadCount > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="btn btn-sm btn-outline-primary"
                        >
                            Đánh dấu tất cả là đã đọc
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="row mb-4">
                    <div className="col-md-6">
                        <select
                            className="form-select"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="">-- Tất cả loại --</option>
                            <option value="payment">Thanh Toán</option>
                            <option value="contract">Hợp Đồng</option>
                            <option value="notification">Thông Báo</option>
                            <option value="repair">Sửa Chữa</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="unreadOnly"
                                checked={showOnlyUnread}
                                onChange={(e) => setShowOnlyUnread(e.target.checked)}
                            />
                            <label className="form-check-label" htmlFor="unreadOnly">
                                Chỉ hiển thị chưa đọc
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="alert alert-info text-center py-5">
                        <i className="bi bi-inbox" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2">Không có thông báo nào</p>
                    </div>
                ) : (
                    <div className="notifications-list">
                        {filteredNotifications.map((notif) => (
                            <div
                                key={notif.id}
                                className={`card mb-3 ${getNotificationColor(notif.type)} ${!notif.isRead ? 'bg-light' : ''}`}
                            >
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-auto">
                                            <i
                                                className={`bi ${notif.icon}`}
                                                style={{ fontSize: '1.5rem' }}
                                            ></i>
                                        </div>
                                        <div className="col flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className="mb-1">
                                                        {notif.title}
                                                        {!notif.isRead && <span className="badge bg-primary ms-2">Mới</span>}
                                                    </h6>
                                                    <p className="mb-1">{notif.message}</p>
                                                    <small className="text-muted">
                                                        <i className="bi bi-clock"></i> {formatDate(notif.date)}
                                                    </small>
                                                </div>
                                                <span className="badge bg-secondary">{getTypeLabel(notif.type)}</span>
                                            </div>
                                        </div>
                                        <div className="col-auto">
                                            <div className="btn-group-vertical" role="group">
                                                {!notif.isRead && (
                                                    <button
                                                        onClick={() => markAsRead(notif.id)}
                                                        className="btn btn-sm btn-outline-primary"
                                                        title="Đánh dấu là đã đọc"
                                                    >
                                                        <i className="bi bi-check"></i>
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notif.id)}
                                                    className="btn btn-sm btn-outline-danger"
                                                    title="Xóa"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
