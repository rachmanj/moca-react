import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

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

interface MigiDetail {
    id: number;
    migi_id: number;
    line: number;
    item_code: string;
    desc: string;
    qty: number;
    stock_price: number;
    total_price: number;
    wo_qty: number;
}

interface MigiDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    migi: MigiRecord | null;
    details: MigiDetail[];
    loading: boolean;
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

export default function MigiDetailModal({ isOpen, onClose, migi, details, loading }: MigiDetailModalProps) {
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
                            <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                <div className="flex items-center justify-between">
                                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                        Details for Document: {migi?.document_number}
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400"
                                        onClick={onClose}
                                    >
                                        <span className="sr-only">Close</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="mt-4 flex justify-center">
                                        <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-3">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Number</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{migi?.document_number}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Document Date</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{formatDate(migi?.document_date)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">WO Number</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{migi?.wo_number || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unit Number</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{migi?.unit_number || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{migi?.category || '-'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                                                <p className="text-sm text-gray-900 dark:text-white">{migi?.status_gi || '-'}</p>
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <h4 className="text-md font-medium text-gray-900 dark:text-white">Item Details</h4>
                                            <div className="mt-2 overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                                    <thead>
                                                        <tr>
                                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                                Line
                                                            </th>
                                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                                Item Code
                                                            </th>
                                                            <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">
                                                                Description
                                                            </th>
                                                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                                Qty
                                                            </th>
                                                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                                Unit Price
                                                            </th>
                                                            <th className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                                                Total Price
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                                                        {details.length > 0 ? (
                                                            details.map((detail) => (
                                                                <tr key={detail.id}>
                                                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                        {detail.line}
                                                                    </td>
                                                                    <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                        {detail.item_code}
                                                                    </td>
                                                                    <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                        {detail.desc}
                                                                    </td>
                                                                    <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                        {detail.qty}
                                                                    </td>
                                                                    <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                        {detail.stock_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                    </td>
                                                                    <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                        {detail.total_price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td
                                                                    colSpan={6}
                                                                    className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                                                                >
                                                                    No details found
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div className="mt-6 flex justify-end">
                                    <button
                                        type="button"
                                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
