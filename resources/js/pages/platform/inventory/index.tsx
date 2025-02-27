import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

export default function InventoryIndex({ success: initialSuccess, inventories = [] }: { success?: string; inventories?: InventoryRecord[] }) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(initialSuccess || null);
    const [pending, setPending] = useState(false);

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

                {/* DataTable Component */}
                <div className="mt-8">
                    <InventoryDataTable data={inventories} pending={pending} />
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
