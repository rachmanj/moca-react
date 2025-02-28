import { XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { Link } from '@inertiajs/react';
import { useMemo, useState } from 'react';
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
    document_number: string;
    document_date: string;
    wo_number: string;
    unit_number: string;
    model_number: string;
    serial_number: string;
    project_code?: string;
}

interface OldcoresDataTableProps {
    data: OldcoreRecord[];
    pending?: boolean;
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

export default function OldcoresDataTable({ data, pending = false }: OldcoresDataTableProps) {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const filteredItems = useMemo(() => {
        if (!filterText) return data;

        return data.filter((item) => {
            const searchText = filterText.toLowerCase();
            return (
                (item.item_code && item.item_code.toLowerCase().includes(searchText)) ||
                (item.desc && item.desc.toLowerCase().includes(searchText)) ||
                (item.project_code && item.project_code.toLowerCase().includes(searchText))
            );
        });
    }, [data, filterText]);

    const subHeaderComponent = useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
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
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pr-3 pl-10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 focus:ring-inset sm:text-sm sm:leading-6"
                        placeholder="Search by item code, description, or project code"
                    />
                    {filterText && (
                        <button onClick={handleClear} className="absolute inset-y-0 right-0 flex items-center pr-3">
                            <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-300" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    const columns = [
        {
            name: 'Item Code',
            selector: (row: OldcoreRecord) => row.item_code || '-',
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row: OldcoreRecord) => row.desc || '-',
            sortable: true,
            grow: 2,
        },
        {
            name: 'Quantity',
            selector: (row: OldcoreRecord) => row.total_qty || 0,
            sortable: true,
            right: true,
        },
        {
            name: 'Warehouse',
            selector: (row: OldcoreRecord) => row.project_code || '-',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: OldcoreRecord) => (
                <Link
                    href={`/oldcores/${row.id}`}
                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    View
                </Link>
            ),
            button: true,
            width: '100px',
        },
    ];

    return (
        <div className="mt-4">
            <DataTable
                columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponent}
                persistTableHead
                theme="dark"
                customStyles={customStyles}
                progressPending={pending}
                progressComponent={
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
                    </div>
                }
                noDataComponent={
                    <div className="flex h-64 items-center justify-center">
                        <p className="text-gray-400">No oldcores found</p>
                    </div>
                }
            />
        </div>
    );
}
