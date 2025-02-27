import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

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

interface InventoryDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    inventory: InventoryRecord | null;
    loading: boolean;
}

export default function InventoryDetailModal({ isOpen, onClose, inventory, loading }: InventoryDetailModalProps) {
    if (!inventory) return null;

    // Format number function
    const formatNumber = (num: number | null | undefined) => {
        if (num === null || num === undefined) return '-';
        return num.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });
    };

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

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="bg-opacity-25 fixed inset-0 bg-black" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                        Inventory Details - {inventory.item_code}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:ring-offset-gray-800 dark:hover:text-gray-400"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-8">
                                        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Item Code</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.item_code || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.description || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Quantity</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(inventory.total_qty)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">UOM</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.uom || '-'}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Unit Price</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(inventory.avg_unit_price)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Amount</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(inventory.total_amount)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Weight (g)</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(inventory.avg_weight)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Weight (g)</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatNumber(inventory.total_weight)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Created At</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(inventory.created_at)}</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Updated At</h4>
                                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{formatDate(inventory.updated_at)}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
