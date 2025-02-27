import { XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

interface GrpoRecord {
    id: number;
    grpo_date: string;
    grpo_create_date: string;
    grpo_no: string;
    unit_no: string;
    for_project: string;
    remarks: string;
    created_at: string;
}

interface GrpoDataTableProps {
    data: GrpoRecord[];
    onViewDetails: (grpo: GrpoRecord) => void;
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

export default function GrpoDataTable({ data, onViewDetails, pending = false }: GrpoDataTableProps) {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

    const columns = useMemo(
        () => [
            {
                name: 'GRPO No',
                selector: (row: GrpoRecord) => row.grpo_no || '-',
                sortable: true,
            },
            {
                name: 'GRPO Date',
                selector: (row: GrpoRecord) => row.grpo_date,
                sortable: true,
                format: (row: GrpoRecord) => formatDate(row.grpo_date),
            },
            {
                name: 'Create Date',
                selector: (row: GrpoRecord) => row.grpo_create_date,
                sortable: true,
                format: (row: GrpoRecord) => formatDate(row.grpo_create_date),
            },
            {
                name: 'Unit No',
                selector: (row: GrpoRecord) => row.unit_no || '-',
                sortable: true,
            },
            {
                name: 'For Project',
                selector: (row: GrpoRecord) => row.for_project || '-',
                sortable: true,
            },
            {
                name: 'Actions',
                cell: (row: GrpoRecord) => (
                    <button
                        onClick={() => onViewDetails(row)}
                        className="rounded-md bg-blue-100 p-2 text-blue-700 hover:bg-blue-200 dark:bg-blue-800 dark:text-blue-100 dark:hover:bg-blue-700"
                        title="View Details"
                    >
                        <EyeIcon className="h-4 w-4" />
                    </button>
                ),
                ignoreRowClick: true,
                button: true,
                width: '80px',
                center: true,
            },
        ],
        [onViewDetails],
    );

    const filteredItems = useMemo(() => {
        if (!filterText) return data;

        return data.filter((item) => {
            return (
                (item.grpo_no && item.grpo_no.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.unit_no && item.unit_no.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.for_project && item.for_project.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.remarks && item.remarks.toLowerCase().includes(filterText.toLowerCase()))
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
                title="GRPO Records"
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
