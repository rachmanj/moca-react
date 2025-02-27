import { type NavGroup } from '@/types';
import { Box, LayoutGrid, Upload, Warehouse } from 'lucide-react';

export const MainNavItems: NavGroup[] = [
    {
        group: 'Platform',
        items: [
            {
                title: 'Dashboard',
                url: '/dashboard',
                icon: LayoutGrid,
            },
            {
                title: 'Inventories',
                url: '/inventory',
                icon: Warehouse,
            },
            {
                title: 'Oldcores',
                url: '/oldcores',
                icon: Box,
            },
            {
                title: 'Migi',
                url: '/migi',
                icon: Upload,
            },
            {
                title: 'GRPO',
                url: '/grpo',
                icon: Upload,
            },
        ],
    },
    {
        group: 'Master',
        items: [
            {
                title: 'Project',
                url: '/project',
                icon: LayoutGrid,
            },
            {
                title: 'Department',
                url: '/department',
                icon: LayoutGrid,
            },
        ],
    },
];
