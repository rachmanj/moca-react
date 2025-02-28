import { Head } from '@inertiajs/react';
import { useEffect } from 'react';

interface OldcoreReceiptRecord {
    id: number;
    receipt_number: string;
    date: string;
    item_code: string;
    desc: string;
    qty: number;
    weight_total: number;
    project: string;
    remarks: string | null;
    given_by: string | null;
    received_by: string;
    created_at: string;
    updated_at: string;
}

interface PrintReceiptProps {
    receipt: OldcoreReceiptRecord;
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

export default function PrintReceipt({ receipt }: PrintReceiptProps) {
    // Automatically trigger print dialog when the component mounts
    useEffect(() => {
        window.print();
    }, []);

    return (
        <div className="min-h-screen bg-white p-8">
            <Head title={`Receipt: ${receipt.receipt_number}`} />

            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="border-b border-gray-200 pb-5">
                    <div className="flex justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">OLDCORE RECEIPT</h1>
                            <p className="mt-1 text-sm text-gray-500">This document confirms the receipt of oldcore items.</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-900">Receipt #: {receipt.receipt_number}</p>
                            <p className="mt-1 text-sm text-gray-500">Date: {formatDate(receipt.date)}</p>
                        </div>
                    </div>
                </div>

                {/* Project Information */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Project Information</h2>
                    <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                        <p className="text-sm text-gray-700">
                            <span className="font-medium">Project:</span> {receipt.project}
                        </p>
                    </div>
                </div>

                {/* Item Details */}
                <div className="mt-8">
                    <h2 className="text-lg font-medium text-gray-900">Item Details</h2>
                    <div className="mt-4 overflow-hidden rounded-md border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Item Code
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Quantity
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium tracking-wider text-gray-500 uppercase">
                                        Weight Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                <tr>
                                    <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">{receipt.item_code}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{receipt.desc}</td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">{receipt.qty}</td>
                                    <td className="px-6 py-4 text-right text-sm whitespace-nowrap text-gray-900">{receipt.weight_total}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Remarks */}
                {receipt.remarks && (
                    <div className="mt-8">
                        <h2 className="text-lg font-medium text-gray-900">Remarks</h2>
                        <div className="mt-4 rounded-md border border-gray-200 bg-gray-50 p-4">
                            <p className="text-sm text-gray-700">{receipt.remarks}</p>
                        </div>
                    </div>
                )}

                {/* Signatures */}
                <div className="mt-16 grid grid-cols-2 gap-8">
                    <div>
                        <p className="text-sm font-medium text-gray-900">Given By:</p>
                        <div className="mt-8 border-t border-gray-200 pt-2">
                            <p className="text-sm text-gray-500">{receipt.given_by || 'Name & Signature'}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">Received By:</p>
                        <div className="mt-8 border-t border-gray-200 pt-2">
                            <p className="text-sm text-gray-500">{receipt.received_by}</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-16 border-t border-gray-200 pt-5">
                    <p className="text-center text-xs text-gray-500">This receipt was generated on {formatDate(new Date().toISOString())}</p>
                </div>
            </div>

            {/* Print-only styles */}
            <style>
                {`
                @media print {
                    body {
                        print-color-adjust: exact;
                        -webkit-print-color-adjust: exact;
                    }
                    @page {
                        size: A4;
                        margin: 1cm;
                    }
                }
                `}
            </style>
        </div>
    );
}
