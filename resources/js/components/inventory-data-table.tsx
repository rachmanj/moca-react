import { XMarkIcon } from '@heroicons/react/24/outline';
import { EyeIcon, MagnifyingGlassIcon } from '@heroicons/react/24/solid';
import { router } from '@inertiajs/react';
import { useMemo, useState } from 'react';
import DataTable from 'react-data-table-component';

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

interface InventoryDataTableProps {
    data: InventoryRecord[];
    pending?: boolean;
}

export default function InventoryDataTable({ data, pending = false }: InventoryDataTableProps) {
    const [filterText, setFilterText] = useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = useState(false);

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

    const columns = useMemo(
        () => [
            {
                name: 'Item Code',
                selector: (row: InventoryRecord) => row.item_code || '-',
                sortable: true,
            },
            {
                name: 'Description',
                selector: (row: InventoryRecord) => row.description || '-',
                sortable: true,
                grow: 2,
            },
            {
                name: 'Quantity',
                selector: (row: InventoryRecord) => row.total_qty,
                sortable: true,
                right: true,
                cell: (row: InventoryRecord) => <div>{formatNumber(row.total_qty)}</div>,
            },
            {
                name: 'UOM',
                selector: (row: InventoryRecord) => row.uom || '-',
                sortable: true,
            },
            {
                name: 'Avg. Weight (kg)',
                selector: (row: InventoryRecord) => row.avg_weight,
                sortable: true,
                right: true,
                cell: (row: InventoryRecord) => <div>{formatNumber(row.avg_weight / 1000)}</div>,
            },
            {
                name: 'Total Weight (kg)',
                selector: (row: InventoryRecord) => row.total_weight,
                sortable: true,
                right: true,
                cell: (row: InventoryRecord) => <div>{formatNumber(row.total_weight / 1000)}</div>,
            },
            {
                name: 'Actions',
                cell: (row: InventoryRecord) => (
                    <button
                        onClick={() => router.visit(`/inventory/${row.id}`)}
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
        [],
    );

    const filteredItems = useMemo(() => {
        if (!filterText) return data;

        return data.filter((item) => {
            return (
                (item.item_code && item.item_code.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.description && item.description.toLowerCase().includes(filterText.toLowerCase())) ||
                (item.uom && item.uom.toLowerCase().includes(filterText.toLowerCase()))
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
                title="Inventory Records"
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
                customStyles={customStyles as any}
                progressPending={pending}
                noDataComponent={<div className="p-4 text-center text-gray-400">{filterText ? 'No matching records found' : 'No records found'}</div>}
            />
        </div>
    );
}
