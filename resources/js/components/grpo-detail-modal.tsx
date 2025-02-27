import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';

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

interface GrpoDetail {
    id: number;
    grpo_id: number;
    item_code: string;
    description: string;
    qty: number;
    unit_price: number;
    item_amount: number;
    uom: string;
    weight: number;
}

interface GrpoDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    grpo: GrpoRecord | null;
    details: GrpoDetail[];
    loading: boolean;
}

export default function GrpoDetailModal({ isOpen, onClose, grpo, details, loading }: GrpoDetailModalProps) {
    if (!grpo) return null;

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
                                        GRPO Details - {grpo.grpo_no}
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

                                <div className="mt-4">
                                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">GRPO Number</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.grpo_no || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">GRPO Date</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.grpo_date || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">GRPO Create Date</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.grpo_create_date || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Unit No</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.unit_no || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">For Project</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.for_project || '-'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Remarks</h4>
                                            <p className="mt-1 text-sm text-gray-900 dark:text-white">{grpo.remarks || '-'}</p>
                                        </div>
                                    </div>

                                    <h4 className="mb-2 text-base font-medium text-gray-700 dark:text-gray-300">Item Details</h4>

                                    {loading ? (
                                        <div className="flex justify-center py-8">
                                            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-indigo-500"></div>
                                        </div>
                                    ) : details.length === 0 ? (
                                        <div className="rounded-md bg-gray-50 p-4 text-center text-sm text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                                            No item details found
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Item Code
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Description
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Qty
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            UOM
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Unit Price
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Amount
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900 dark:text-white"
                                                        >
                                                            Weight
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                                    {details.map((detail) => (
                                                        <tr key={detail.id}>
                                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.item_code}
                                                            </td>
                                                            <td className="px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                                {detail.description}
                                                            </td>
                                                            <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.qty}
                                                            </td>
                                                            <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.uom}
                                                            </td>
                                                            <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.unit_price?.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })}
                                                            </td>
                                                            <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.item_amount?.toLocaleString(undefined, {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                })}
                                                            </td>
                                                            <td className="px-3 py-4 text-right text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">
                                                                {detail.weight}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
