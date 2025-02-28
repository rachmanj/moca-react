import { XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import OldcoresDashboard from '@/components/oldcores-dashboard';
import OldcoresDataTable from '@/components/oldcores-data-table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import axios from 'axios';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Oldcores',
        href: '/oldcores',
    },
];

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
    wo_qty: number;
    project_code: string;
    created_at: string;
    updated_at: string;
    document_number?: string;
    document_date?: string;
    wo_number?: string;
    unit_number?: string;
    model_number?: string;
    serial_number?: string;
}

interface OldcoreReceiptRecord {
    id: number;
    receipt_number: string;
    migi_detail_id: number | null;
    date: string;
    item_code: string;
    desc: string;
    qty: number;
    weight_total: number;
    project: string;
    remarks: string;
    given_by: string;
    received_by: string;
    created_at: string;
    updated_at: string;
}

interface Stats {
    totalItems: number;
    totalQuantity: number;
}

interface MonthlyData {
    month: string;
    total_quantity: number;
}

type TabType = 'dashboard' | 'list' | 'issued' | 'receive';

interface OldcoresIndexProps {
    success?: string;
    oldcores?: OldcoreRecord[];
    stats?: Stats;
    monthlyData?: MonthlyData[];
}

// Custom theme for DataTable
const customTheme = {
    text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
    },
    background: {
        default: '#111827',
    },
    context: {
        background: '#374151',
        text: '#FFFFFF',
    },
    divider: {
        default: '#4b5563',
    },
    button: {
        default: '#6366f1',
        hover: '#4f46e5',
        focus: '#4f46e5',
        disabled: '#9ca3af',
    },
    sortFocus: {
        default: '#818cf8',
    },
    highlightOnHover: {
        default: '#1f2937',
        text: '#ffffff',
    },
};

// Custom styles for DataTable
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

export default function OldcoresIndex({ success: initialSuccess, oldcores = [], stats, monthlyData }: OldcoresIndexProps) {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(initialSuccess || null);
    const [pending, setPending] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [migiDetails, setMigiDetails] = useState<MigiDetailRecord[]>([]);
    const [oldcoreReceipts, setOldcoreReceipts] = useState<OldcoreReceiptRecord[]>([]);
    const [loadingMigiDetails, setLoadingMigiDetails] = useState(false);
    const [loadingReceipts, setLoadingReceipts] = useState(false);

    // Search state
    const [issuedFilterText, setIssuedFilterText] = useState('');
    const [receiveFilterText, setReceiveFilterText] = useState('');
    const [resetIssuedPaginationToggle, setResetIssuedPaginationToggle] = useState(false);
    const [resetReceivePaginationToggle, setResetReceivePaginationToggle] = useState(false);

    // Show success toast if initialSuccess is provided
    useEffect(() => {
        if (initialSuccess) {
            toast.success(initialSuccess);
        }
    }, [initialSuccess]);

    // Fetch migi details when the issued tab is selected
    useEffect(() => {
        if (activeTab === 'issued' && migiDetails.length === 0) {
            fetchMigiDetails();
        }
    }, [activeTab]);

    // Fetch oldcore receipts when the receive tab is selected
    useEffect(() => {
        if (activeTab === 'receive' && oldcoreReceipts.length === 0) {
            fetchOldcoreReceipts();
        }
    }, [activeTab]);

    const fetchMigiDetails = async () => {
        try {
            setLoadingMigiDetails(true);
            const response = await axios.get('/api/oldcores/issued');
            setMigiDetails(response.data);
            setLoadingMigiDetails(false);
        } catch (err) {
            console.error('Error fetching migi details:', err);
            setError('Failed to load issued items');
            setLoadingMigiDetails(false);
        }
    };

    const fetchOldcoreReceipts = async () => {
        try {
            setLoadingReceipts(true);
            const response = await axios.get('/api/oldcores/receipts');
            setOldcoreReceipts(response.data);
            setLoadingReceipts(false);
        } catch (err) {
            console.error('Error fetching oldcore receipts:', err);
            setError('Failed to load receipt items');
            setLoadingReceipts(false);
        }
    };

    // Filter issued items based on search text
    const filteredIssuedItems = useMemo(() => {
        if (!issuedFilterText) return migiDetails;

        return migiDetails.filter((item) => {
            const searchText = issuedFilterText.toLowerCase();
            return (
                (item.document_number && item.document_number.toLowerCase().includes(searchText)) ||
                (item.item_code && item.item_code.toLowerCase().includes(searchText)) ||
                (item.desc && item.desc.toLowerCase().includes(searchText)) ||
                (item.project_code && item.project_code.toLowerCase().includes(searchText))
            );
        });
    }, [migiDetails, issuedFilterText]);

    // Filter received items based on search text
    const filteredReceiptItems = useMemo(() => {
        if (!receiveFilterText) return oldcoreReceipts;

        return oldcoreReceipts.filter((item) => {
            const searchText = receiveFilterText.toLowerCase();
            return (
                (item.receipt_number && item.receipt_number.toLowerCase().includes(searchText)) ||
                (item.item_code && item.item_code.toLowerCase().includes(searchText)) ||
                (item.desc && item.desc.toLowerCase().includes(searchText)) ||
                (item.project && item.project.toLowerCase().includes(searchText))
            );
        });
    }, [oldcoreReceipts, receiveFilterText]);

    // Search component for Issued tab
    const issuedSubHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (issuedFilterText) {
                setResetIssuedPaginationToggle(!resetIssuedPaginationToggle);
                setIssuedFilterText('');
            }
        };

        return (
            <div className="mb-4 flex w-full items-center">
                <div className="relative max-w-sm flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        value={issuedFilterText}
                        onChange={(e) => setIssuedFilterText(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pr-3 pl-10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                        placeholder="Search by document, item code, description, or project"
                    />
                    {issuedFilterText && (
                        <button onClick={handleClear} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        );
    }, [issuedFilterText, resetIssuedPaginationToggle]);

    // Search component for Receive tab
    const receiveSubHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (receiveFilterText) {
                setResetReceivePaginationToggle(!resetReceivePaginationToggle);
                setReceiveFilterText('');
            }
        };

        return (
            <div className="mb-4 flex w-full items-center justify-between">
                <div className="relative max-w-sm flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        value={receiveFilterText}
                        onChange={(e) => setReceiveFilterText(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pr-3 pl-10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                        placeholder="Search by receipt number, item code, description, or project"
                    />
                    {receiveFilterText && (
                        <button onClick={handleClear} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" aria-hidden="true" />
                        </button>
                    )}
                </div>
                <Link
                    href={route('oldcores.receipts.create')}
                    className="ml-4 inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Create New Receipt
                </Link>
            </div>
        );
    }, [receiveFilterText, resetReceivePaginationToggle]);

    // Define columns for the Issued Items DataTable
    const issuedColumns = [
        {
            name: 'Document',
            selector: (row: MigiDetailRecord) => row.document_number || '',
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row: MigiDetailRecord) => row.document_date || '',
            sortable: true,
        },
        {
            name: 'Item Code',
            selector: (row: MigiDetailRecord) => row.item_code,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row: MigiDetailRecord) => row.desc,
            sortable: true,
            wrap: true,
            grow: 2,
        },
        {
            name: 'Quantity',
            selector: (row: MigiDetailRecord) => row.qty,
            sortable: true,
            right: true,
        },
        {
            name: 'Project',
            selector: (row: MigiDetailRecord) => row.project_code,
            sortable: true,
        },
        {
            name: 'Unit',
            selector: (row: MigiDetailRecord) => row.unit_number || '',
            sortable: true,
        },
    ];

    // Define columns for the Received Items DataTable
    const receiptColumns = [
        {
            name: 'Receipt #',
            selector: (row: OldcoreReceiptRecord) => row.receipt_number || '',
            sortable: true,
        },
        {
            name: 'Date',
            selector: (row: OldcoreReceiptRecord) => row.date,
            sortable: true,
        },
        {
            name: 'Item Code',
            selector: (row: OldcoreReceiptRecord) => row.item_code,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row: OldcoreReceiptRecord) => row.desc,
            sortable: true,
            wrap: true,
            grow: 2,
        },
        {
            name: 'Quantity',
            selector: (row: OldcoreReceiptRecord) => row.qty,
            sortable: true,
            right: true,
        },
        {
            name: 'Weight',
            selector: (row: OldcoreReceiptRecord) => row.weight_total,
            sortable: true,
            right: true,
            format: (row: OldcoreReceiptRecord) => {
                const weight = parseFloat(row.weight_total as any);
                return isNaN(weight) ? '0.00 kg' : `${weight.toFixed(2)} kg`;
            },
        },
        {
            name: 'Project',
            selector: (row: OldcoreReceiptRecord) => row.project,
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: OldcoreReceiptRecord) => (
                <div className="flex space-x-2">
                    <Link href={route('oldcores.receipts.edit', row.id)} className="text-indigo-400 hover:text-indigo-300">
                        Edit
                    </Link>
                    <Link href={route('oldcores.receipts.print', row.id)} className="text-green-400 hover:text-green-300" target="_blank">
                        Print
                    </Link>
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this receipt?')) {
                                axios
                                    .delete(route('oldcores.receipts.destroy', row.id))
                                    .then(() => {
                                        toast.success('Receipt deleted successfully');
                                        fetchOldcoreReceipts();
                                    })
                                    .catch((error) => {
                                        console.error('Error deleting receipt:', error);
                                        toast.error('Failed to delete receipt');
                                    });
                            }
                        }}
                        className="text-red-400 hover:text-red-300"
                    >
                        Delete
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Oldcores Management" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Oldcores Management</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">View and manage oldcores items from MIGI details.</p>
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
                        <button
                            onClick={() => setActiveTab('issued')}
                            className={`${
                                activeTab === 'issued'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                            } border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap`}
                            aria-current={activeTab === 'issued' ? 'page' : undefined}
                        >
                            Issued
                        </button>
                        <button
                            onClick={() => setActiveTab('receive')}
                            className={`${
                                activeTab === 'receive'
                                    ? 'border-indigo-500 text-indigo-400'
                                    : 'border-transparent text-gray-400 hover:border-gray-300 hover:text-gray-300'
                            } border-b-2 px-1 py-4 text-sm font-medium whitespace-nowrap`}
                            aria-current={activeTab === 'receive' ? 'page' : undefined}
                        >
                            Receive
                        </button>
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === 'dashboard' && <OldcoresDashboard data={oldcores} stats={stats} monthlyData={monthlyData} />}

                    {activeTab === 'list' && <OldcoresDataTable data={oldcores} pending={pending} />}

                    {activeTab === 'issued' && (
                        <div>
                            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Issued Items</h2>
                            <DataTable
                                columns={issuedColumns}
                                data={filteredIssuedItems}
                                pagination
                                paginationResetDefaultPage={resetIssuedPaginationToggle}
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                progressPending={loadingMigiDetails}
                                progressComponent={
                                    <div className="flex h-64 items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
                                    </div>
                                }
                                noDataComponent={
                                    <div className="flex h-64 items-center justify-center">
                                        <p className="text-gray-400">No issued items found</p>
                                    </div>
                                }
                                subHeader
                                subHeaderComponent={issuedSubHeaderComponent}
                                persistTableHead
                                theme="dark"
                                customStyles={customStyles}
                                highlightOnHover
                                pointerOnHover
                                responsive
                            />
                        </div>
                    )}

                    {activeTab === 'receive' && (
                        <div>
                            <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">Received Items</h2>
                            <DataTable
                                columns={receiptColumns}
                                data={filteredReceiptItems}
                                pagination
                                paginationResetDefaultPage={resetReceivePaginationToggle}
                                paginationPerPage={10}
                                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                                progressPending={loadingReceipts}
                                progressComponent={
                                    <div className="flex h-64 items-center justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
                                    </div>
                                }
                                noDataComponent={
                                    <div className="flex h-64 items-center justify-center">
                                        <p className="text-gray-400">No received items found</p>
                                    </div>
                                }
                                subHeader
                                subHeaderComponent={receiveSubHeaderComponent}
                                persistTableHead
                                theme="dark"
                                customStyles={customStyles}
                                highlightOnHover
                                pointerOnHover
                                responsive
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
