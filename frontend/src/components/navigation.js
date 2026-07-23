import {
    Dashboard,
    Apartment,
    Business,
    Community,
    FileReport,
    UserCircle,
} from '@boxicons/react';

export const navigationItems = [
    {
        path: '/dashboard',
        label: 'Dashboard',
        icon: Dashboard,
    },
    {
        path: '/apartments',
        label: 'Căn Hộ',
        icon: Apartment,
    },
    {
        path: '/buildings',
        label: 'Toà Nhà',
        icon: Business,
    },
    {
        path: '/tenants',
        label: 'Người Thuê',
        icon: Community,
    },
    {
        path: '/contract',
        label: 'Hợp Đồng',
        icon: FileReport,
    },
    {
        path: '/profile',
        label: 'Cá Nhân',
        icon: UserCircle,
    },
];
