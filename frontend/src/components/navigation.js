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
import { FaHome, FaBuilding, FaUser, FaFileContract, FaUserCog } from 'react-icons/fa';

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
        label: 'Căn Hộ',
        icon: FaBuilding,
        roles: ['NguoiThue'],
    },
    {
        path: '/contracts',
        label: 'Hợp Đồng',
        icon: FaFileContract,
        roles: ['NguoiThue'],
    },
    {
        path: '/change-password',
        label: 'Đổi Mật Khẩu',
        icon: FaUserCog,
        roles: ['ChuThue', 'NguoiThue'],
    },
];
