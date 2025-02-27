import { type NavGroup } from '@/types';
import { Box, LayoutGrid, Upload } from 'lucide-react';

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
                title: 'Migi',
                url: '/migi',
                icon: Upload,
            },
            {
                title: 'Oldcores',
                url: '/oldcores',
                icon: Box,
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
