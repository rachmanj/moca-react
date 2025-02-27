import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

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

interface GrpoDetailRecord {
    id: number;
    grpo_id: number;
    grpo_no: string;
    grpo_date: string;
    unit_no: string;
    for_project: string;
    qty: number;
    unit_price: number;
    item_amount: number;
    uom: string;
    weight: number;
}

interface InventoryShowProps {
    inventory: InventoryRecord;
    grpoDetails: GrpoDetailRecord[];
    success?: string;
}

export default function InventoryShow({ inventory, grpoDetails, success }: InventoryShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Inventory',
            href: '/inventory',
        },
        {
            title: inventory.item_code,
            href: `/inventory/${inventory.id}`,
        },
    ];

    // Show success toast if provided
    useEffect(() => {
        if (success) {
            toast.success(success);
        }
    }, [success]);

    // Format date function
    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format number function
    const formatNumber = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-';

        // Ensure we're using a locale that uses commas for thousands separators
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num);
    };

    const customStyles = {
        headRow: {
            style: {
                backgroundColor: '#1f2937',
                color: '#ffffff',
                borderBottomWidth: '1px',
                borderBottomColor: '#374151',
            },
        },
        headCells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
                fontWeight: '600',
            },
        },
        rows: {
            style: {
                backgroundColor: '#1f2937',
                color: '#d1d5db',
                borderBottomStyle: 'solid',
                borderBottomWidth: '1px',
                borderBottomColor: '#374151',
                '&:hover': {
                    backgroundColor: '#374151',
                },
            },
        },
        cells: {
            style: {
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        pagination: {
            style: {
                backgroundColor: '#1f2937',
                color: '#d1d5db',
                borderTopWidth: '1px',
                borderTopColor: '#374151',
            },
            pageButtonsStyle: {
                color: '#d1d5db',
                fill: '#d1d5db',
                '&:disabled': {
                    color: '#6b7280',
                    fill: '#6b7280',
                },
                '&:hover:not(:disabled)': {
                    backgroundColor: '#374151',
                },
                '&:focus': {
                    outline: 'none',
                    backgroundColor: '#374151',
                },
            },
        },
    };

    const columns = [
        {
            name: 'GRPO No',
            selector: (row: GrpoDetailRecord) => row.grpo_no || '-',
            sortable: true,
        },
        {
            name: 'GRPO Date',
            selector: (row: GrpoDetailRecord) => row.grpo_date,
            sortable: true,
            cell: (row: GrpoDetailRecord) => <div>{formatDate(row.grpo_date)}</div>,
        },
        {
            name: 'Unit No',
            selector: (row: GrpoDetailRecord) => row.unit_no || '-',
            sortable: true,
        },
        {
            name: 'For Project',
            selector: (row: GrpoDetailRecord) => row.for_project || '-',
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (row: GrpoDetailRecord) => row.qty,
            sortable: true,
            right: true,
            cell: (row: GrpoDetailRecord) => <div>{formatNumber(row.qty)}</div>,
        },
        {
            name: 'Weight (g)',
            selector: (row: GrpoDetailRecord) => row.weight,
            sortable: true,
            right: true,
            cell: (row: GrpoDetailRecord) => <div>{formatNumber(row.weight)}</div>,
        },
        {
            name: 'Total Weight (g)',
            selector: (row: GrpoDetailRecord) => row.weight * row.qty,
            sortable: true,
            right: true,
            cell: (row: GrpoDetailRecord) => <div>{formatNumber(row.weight * row.qty)}</div>,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Inventory - ${inventory.item_code}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Inventory Details - {inventory.item_code}</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Detailed information and GRPO history for this inventory item.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 sm:ml-16">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:focus:ring-offset-gray-800"
                        >
                            Back to List
                        </button>
                    </div>
                </div>

                {/* Inventory Details Card */}
                <div className="mt-8 overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-white">Item Information</h3>
                        <div className="mt-5 border-t border-gray-700 pt-5">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Item Code</dt>
                                    <dd className="mt-1 text-sm text-white">{inventory.item_code || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Description</dt>
                                    <dd className="mt-1 text-sm text-white">{inventory.description || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Total Quantity</dt>
                                    <dd className="mt-1 text-sm text-white">{formatNumber(inventory.total_qty)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">UOM</dt>
                                    <dd className="mt-1 text-sm text-white">{inventory.uom || '-'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Average Unit Price</dt>
                                    <dd className="mt-1 text-sm text-white">{formatNumber(inventory.avg_unit_price)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Total Amount</dt>
                                    <dd className="mt-1 text-sm text-white">{formatNumber(inventory.total_amount)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Average Weight (g)</dt>
                                    <dd className="mt-1 text-sm text-white">{formatNumber(inventory.avg_weight)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Total Weight (g)</dt>
                                    <dd className="mt-1 text-sm text-white">{formatNumber(inventory.total_weight)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Created At</dt>
                                    <dd className="mt-1 text-sm text-white">{formatDate(inventory.created_at)}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-400">Updated At</dt>
                                    <dd className="mt-1 text-sm text-white">{formatDate(inventory.updated_at)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>

                {/* GRPO History Table */}
                <div className="mt-8">
                    <h3 className="mb-4 text-lg font-medium text-white">GRPO History</h3>
                    <div className="rounded-lg bg-gray-800 p-4 shadow">
                        <DataTable
                            columns={columns}
                            data={grpoDetails}
                            pagination
                            persistTableHead
                            highlightOnHover
                            responsive
                            theme="dark"
                            customStyles={customStyles as any}
                            noDataComponent={<div className="p-4 text-center text-gray-400">No GRPO history found</div>}
                        />
                    </div>
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
