// import {
//     Dashboard,
//     Apartment,
//     Business,
//     Community,
//     FileReport,
//     UserCircle,
// } from '@boxicons/react';

// export const navigationItems = [
//     {
//         path: '/dashboard',
//         label: 'Dashboard',
//         icon: Dashboard,
//     },
//     {
//         path: '/apartments',
//         label: 'Căn Hộ',
//         icon: Apartment,
//     },
//     {
//         path: '/buildings',
//         label: 'Toà Nhà',
//         icon: Business,
//     },
//     {
//         path: '/tenants',
//         label: 'Người Thuê',
//         icon: Community,
//     },
//     {
//         path: '/contract',
//         label: 'Hợp Đồng',
//         icon: FileReport,
//     },
//     {
//         path: '/profile',
//         label: 'Cá Nhân',
//         icon: UserCircle,
//     },
// ];
import { FaHome, FaBuilding, FaUser, FaFileContract, FaUserCog, FaWrench, FaHistory, FaBell } from 'react-icons/fa';

export const navigationItems = [
    // Admin Routes
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: FaHome,
        roles: ['ChuThue'],
    },
    {
        path: '/apartments',
        label: 'Căn Hộ',
        icon: FaBuilding,
        roles: ['ChuThue'],
    },
    {
        path: '/buildings',
        label: 'Toà Nhà',
        icon: FaBuilding,
        roles: ['ChuThue'],
    },
    {
        path: '/tenants',
        label: 'Người Thuê',
        icon: FaUser,
        roles: ['ChuThue'],
    },
    {
        path: '/contracts',
        label: 'Hợp Đồng',
        icon: FaFileContract,
        roles: ['ChuThue'],
    },
    // User Routes
    {
        path: '/apartments',
        label: 'Danh Sách Căn Hộ',
        icon: FaBuilding,
        roles: ['NguoiThue'],
    },
    {
        path: '/contracts',
        label: 'Hợp Đồng Của Tôi',
        icon: FaFileContract,
        roles: ['NguoiThue'],
    },
    {
        path: '/payment-history',
        label: 'Lịch Sử Thanh Toán',
        icon: FaHistory,
        roles: ['NguoiThue'],
    },
    {
        path: '/repair-request',
        label: 'Yêu Cầu Sửa Chữa',
        icon: FaWrench,
        roles: ['NguoiThue'],
    },
    {
        path: '/notifications',
        label: 'Thông Báo',
        icon: FaBell,
        roles: ['NguoiThue'],
    },
    {
        path: '/profile',
        label: 'Thông Tin Cá Nhân',
        icon: FaUserCog,
        roles: ['NguoiThue'],
    },
    {
        path: '/change-password',
        label: 'Đổi Mật Khẩu',
        icon: FaUserCog,
        roles: ['NguoiThue', 'ChuThue'],
    },
];
