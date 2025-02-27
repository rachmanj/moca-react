import { XMarkIcon } from '@heroicons/react/24/outline';
import { MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

interface MigiRecord {
    id: number;
    document_number: string;
    document_date: string;
    creation_date: string;
    wo_number: string;
    unit_number: string;
    model_number: string;
    serial_number: string;
    category: string;
    status_gi: string;
    created_at: string;
}

interface MigiDataTableProps {
    data: MigiRecord[];
    onViewDetails: (record: MigiRecord) => void;
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
            color: '#ffffff',
            borderTopWidth: '1px',
            borderTopColor: 'rgba(255, 255, 255, 0.2)',
        },
        pageButtonsStyle: {
            color: '#d1d5db',
            fill: '#d1d5db',
            '&:disabled': {
                color: '#6b7280',
                fill: '#6b7280',
            },
            '&:hover:not(:disabled)': {
                backgroundColor: '#1f2937',
            },
            '&:focus': {
                outline: 'none',
                backgroundColor: '#1f2937',
            },
        },
    },
};

export default function MigiDataTable({ data, onViewDetails, pending = false }: MigiDataTableProps) {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const columns = [
        {
            name: 'Document No',
            selector: (row: MigiRecord) => row.document_number,
            sortable: true,
        },
        {
            name: 'Document Date',
            selector: (row: MigiRecord) => row.document_date,
            sortable: true,
            format: (row: MigiRecord) => formatDate(row.document_date),
        },
        {
            name: 'Creation Date',
            selector: (row: MigiRecord) => row.creation_date,
            sortable: true,
            format: (row: MigiRecord) => formatDate(row.creation_date),
        },
        {
            name: 'WO Number',
            selector: (row: MigiRecord) => row.wo_number || '-',
            sortable: true,
        },
        {
            name: 'Unit Number',
            selector: (row: MigiRecord) => row.unit_number || '-',
            sortable: true,
        },
        {
            name: 'Category',
            selector: (row: MigiRecord) => row.category || '-',
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row: MigiRecord) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => onViewDetails(row)}
                        className="rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
                    >
                        View Details
                    </button>
                </div>
            ),
        },
    ];

    const filteredItems = useMemo(() => {
        if (!filterText) return data;

        return data.filter((item) => {
            return (
                (item.document_number && item.document_number.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.wo_number && item.wo_number.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.unit_number && item.unit_number.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.category && item.category.toLowerCase().includes(filterText.toLowerCase()))
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
                <div className="relative max-w-md flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pr-3 pl-10 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:ring-inset sm:text-sm sm:leading-6"
                        id="search"
                        placeholder="Search records..."
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                    {filterText && (
                        <button className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-white" onClick={handleClear}>
                            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                </div>
            </div>
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div className="rounded-lg bg-gray-800 p-4 shadow">
            <DataTable
                title="MIGI Records"
                columns={columns}
                data={filteredItems}
                pagination
                paginationResetDefaultPage={resetPaginationToggle}
                subHeader
                subHeaderComponent={subHeaderComponent}
                persistTableHead
                highlightOnHover
                responsive
                theme="dark"
                customStyles={customStyles}
                progressPending={pending}
                noDataComponent={<div className="p-4 text-center text-gray-400">{filterText ? 'No matching records found' : 'No records found'}</div>}
            />
        </div>
    );
}
