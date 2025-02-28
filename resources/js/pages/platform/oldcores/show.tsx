import { Head, Link } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import DataTable from 'react-data-table-component';

interface OldcoreRecord {
    id: number;
    migi_detail_id: number;
    item_code: string;
    desc: string;
    total_qty: number;
    created_at: string;
    updated_at: string;
    line: number;
    stock_price: number;
    total_price: number;
    project_code: string;
    document_number: string;
    document_date: string;
    wo_number: string;
    unit_number: string;
    model_number: string;
    serial_number: string;
}

interface MigiDetailRecord {
    id: number;
    migi_id: number;
    line: number;
    item_code: string;
    desc: string;
    qty: number;
    stock_price: number;
    total_price: number;
    project_code: string;
    created_at: string;
    document_number: string;
    document_date: string;
    wo_number: string;
    unit_number: string;
}

interface OldcoreShowProps {
    oldcore: OldcoreRecord;
    history: MigiDetailRecord[];
}

const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const customStyles = {
    headRow: {
        style: {
            backgroundColor: '#1f2937',
            color: '#ffffff',
            borderBottomWidth: '1px',
            borderBottomColor: 'rgba(255, 255, 255, 0.2)',
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
            backgroundColor: '#111827',
            borderBottomWidth: '1px',
            borderBottomStyle: 'solid' as const,
            borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            '&:hover': {
                backgroundColor: '#1f2937',
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
            backgroundColor: '#111827',
            color: '#f9fafb',
            borderTopWidth: '1px',
            borderTopColor: 'rgba(255, 255, 255, 0.1)',
        },
        pageButtonsStyle: {
            color: '#f9fafb',
            fill: '#f9fafb',
            '&:disabled': {
                color: '#4b5563',
                fill: '#4b5563',
            },
        },
    },
};

export default function OldcoreShow({ oldcore, history }: OldcoreShowProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Oldcores',
            href: '/oldcores',
        },
        {
            title: oldcore.item_code,
            href: `/oldcores/${oldcore.id}`,
        },
    ];

    const historyColumns = [
        {
            name: 'Document #',
            selector: (row: MigiDetailRecord) => row.document_number || '-',
            sortable: true,
        },
        {
            name: 'Document Date',
            selector: (row: MigiDetailRecord) => formatDate(row.document_date),
            sortable: true,
        },
        {
            name: 'WO Number',
            selector: (row: MigiDetailRecord) => row.wo_number || '-',
            sortable: true,
        },
        {
            name: 'Unit Number',
            selector: (row: MigiDetailRecord) => row.unit_number || '-',
            sortable: true,
        },
        {
            name: 'Quantity',
            selector: (row: MigiDetailRecord) => row.qty || 0,
            sortable: true,
            right: true,
        },
        {
            name: 'Project Code',
            selector: (row: MigiDetailRecord) => row.project_code || '-',
            sortable: true,
        },
        {
            name: 'Created At',
            selector: (row: MigiDetailRecord) => formatDate(row.created_at),
            sortable: true,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Oldcore: ${oldcore.item_code}`} />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <Link href="/oldcores" className="mb-4 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300">
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Oldcores
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Oldcore Details</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Detailed information about the oldcore item and its history.</p>
                    </div>
                </div>

                {/* Oldcore Details Card */}
                <div className="mt-6 overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="mb-4 text-lg leading-6 font-medium text-white">Item Information</h3>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Item Code</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.item_code}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Description</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.desc}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Total Quantity</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.total_qty}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Project Code</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.project_code}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Document Information Card */}
                <div className="mt-6 overflow-hidden rounded-lg bg-gray-800 shadow">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="mb-4 text-lg leading-6 font-medium text-white">Document Information</h3>
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Document Number</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.document_number || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Document Date</dt>
                                <dd className="mt-1 text-sm text-white">{formatDate(oldcore.document_date)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">WO Number</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.wo_number || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Unit Number</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.unit_number || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Model Number</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.model_number || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Serial Number</dt>
                                <dd className="mt-1 text-sm text-white">{oldcore.serial_number || '-'}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Created At</dt>
                                <dd className="mt-1 text-sm text-white">{formatDate(oldcore.created_at)}</dd>
                            </div>
                            <div>
                                <dt className="text-sm font-medium text-gray-400">Updated At</dt>
                                <dd className="mt-1 text-sm text-white">{formatDate(oldcore.updated_at)}</dd>
                            </div>
                        </div>
                    </div>
                </div>

                {/* History Table */}
                <div className="mt-8">
                    <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Item History</h2>
                    <p className="mb-4 text-sm text-gray-700 dark:text-gray-300">History of MIGI details that affected this oldcore item.</p>
                    <DataTable
                        columns={historyColumns}
                        data={history}
                        pagination
                        persistTableHead
                        theme="dark"
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="flex h-64 items-center justify-center">
                                <p className="text-gray-400">No history found for this item</p>
                            </div>
                        }
                    />
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
