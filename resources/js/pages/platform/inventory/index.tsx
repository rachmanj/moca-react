import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import InventoryDashboard from '@/components/inventory-dashboard';
import InventoryDataTable from '@/components/inventory-data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inventory',
        href: '/inventory',
    },
];

interface InventoryRecord {
    id: number;
    item_code: string;
    description: string;
    total_qty: number;
    avg_unit_price: number;
    total_amount: number;
    uom: string;
    avg_weight: number;
    total_weight: number;
    created_at: string;
    updated_at: string;
}

interface Stats {
    totalItems: number;
    totalQuantity: number;
    totalWeight: number;
}

interface MonthlyData {
    month: string;
    total_weight: number;
}

type TabType = 'dashboard' | 'list';

interface InventoryIndexProps {
    success?: string;
    inventories?: InventoryRecord[];
    stats?: Stats;
    monthlyData?: MonthlyData[];
}

export default function InventoryIndex({ success: initialSuccess, inventories = [], stats, monthlyData }: InventoryIndexProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(initialSuccess || null);
    const [pending, setPending] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');

    // Show success toast if initialSuccess is provided
    useEffect(() => {
        if (initialSuccess) {
            toast.success(initialSuccess);
        }
    }, [initialSuccess]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inventory Management" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory Management</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">View and manage inventory items.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mt-6 border-b border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`${
                                activeTab === 'dashboard'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                            } border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap`}
                            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
                        >
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('list')}
                            className={`${
                                activeTab === 'list'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                            } border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap`}
                            aria-current={activeTab === 'list' ? 'page' : undefined}
                        >
                            List
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'dashboard' ? (
                        <InventoryDashboard data={inventories} stats={stats} monthlyData={monthlyData} />
                    ) : (
                        <InventoryDataTable data={inventories} pending={pending} />
                    )}
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
