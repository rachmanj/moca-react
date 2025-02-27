import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Head, router } from '@inertiajs/react';
import { Fragment, useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

import MigiDataTable from '@/components/migi-data-table';
import MigiDetailModal from '@/components/migi-detail-modal';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Migi',
        href: '/migi',
    },
];

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

export default function MigiPage({
    success: initialSuccess,
    hasTemporaryData = false,
    migis = [],
}: {
    success?: string;
    hasTemporaryData?: boolean;
    migis?: MigiRecord[];
}) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [truncating, setTruncating] = useState(false);
    const [converting, setConverting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(initialSuccess || null);
    const [fileName, setFileName] = useState<string>('No file selected');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [selectedMigi, setSelectedMigi] = useState<MigiRecord | null>(null);
    const [migiDetails, setMigiDetails] = useState<MigiDetail[]>([]);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(false);

    // Show success toast if initialSuccess is provided
    useEffect(() => {
        if (initialSuccess) {
            toast.success(initialSuccess);
        }
    }, [initialSuccess]);

    const handleViewDetails = (migi: MigiRecord) => {
        setSelectedMigi(migi);
        setLoadingDetails(true);

        fetch(`/api/migi/${migi.id}/details`)
            .then((response) => response.json())
            .then((data) => {
                setMigiDetails(data);
                setIsDetailModalOpen(true);
                setLoadingDetails(false);
            })
            .catch((error) => {
                console.error('Error fetching details:', error);
                toast.error('Failed to load details');
                setLoadingDetails(false);
            });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : 'No file selected');
        setError(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            setError('Please select a file to upload');
            toast.error('Please select a file to upload');
            return;
        }

        // Check if file is Excel
        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.oasis.opendocument.spreadsheet',
            'text/csv',
        ];

        if (!validTypes.includes(file.type)) {
            setError('Please upload a valid Excel file');
            toast.error('Please upload a valid Excel file');
            return;
        }

        // Show confirmation dialog
        Swal.fire({
            title: 'Confirm Upload',
            text: `Are you sure you want to upload ${file.name}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, upload it!',
        }).then((result) => {
            if (result.isConfirmed) {
                uploadFile();
            }
        });
    };

    const uploadFile = () => {
        setUploading(true);
        setError(null);
        setSuccess(null);

        // Show loading toast
        const loadingToastId = toast.loading('Uploading file...');

        const formData = new FormData();
        formData.append('file_upload', file as File);

        router.post('/migi/upload', formData, {
            onSuccess: () => {
                setSuccess('File uploaded successfully!');
                setFile(null);
                setFileName('No file selected');
                setIsUploadModalOpen(false);

                // Reset the file input
                const fileInput = document.getElementById('file-upload') as HTMLInputElement;
                if (fileInput) fileInput.value = '';

                // Update loading toast to success
                toast.update(loadingToastId, {
                    render: 'File uploaded successfully!',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                });

                // Refresh the page to update the DataTable
                router.reload();
            },
            onError: (errors) => {
                const errorMessage = errors.file_upload || 'Failed to upload file. Please try again.';
                setError(errorMessage);

                // Update loading toast to error
                toast.update(loadingToastId, {
                    render: errorMessage,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                });
            },
            onFinish: () => {
                setUploading(false);
            },
        });
    };

    const handleTruncateTable = () => {
        Swal.fire({
            title: 'Confirm Truncate',
            text: 'Are you sure you want to clear all temporary data? This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear data!',
        }).then((result) => {
            if (result.isConfirmed) {
                truncateTable();
            }
        });
    };

    const truncateTable = () => {
        setTruncating(true);

        // Show loading toast
        const loadingToastId = toast.loading('Clearing temporary data...');

        router.post(
            '/migi/truncate',
            {},
            {
                onSuccess: () => {
                    // Update loading toast to success
                    toast.update(loadingToastId, {
                        render: 'Temporary data cleared successfully!',
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                    });

                    setSuccess('Temporary data cleared successfully!');

                    // Refresh the page to update the DataTable
                    router.reload();
                },
                onError: (errors) => {
                    const errorMessage = errors.message || 'Failed to clear temporary data. Please try again.';
                    setError(errorMessage);

                    // Update loading toast to error
                    toast.update(loadingToastId, {
                        render: errorMessage,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                    });
                },
                onFinish: () => {
                    setTruncating(false);
                },
            },
        );
    };

    const handleConvertData = () => {
        Swal.fire({
            title: 'Confirm Conversion',
            text: 'Are you sure you want to convert the temporary data to permanent records?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#4f46e5',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, convert data!',
        }).then((result) => {
            if (result.isConfirmed) {
                convertData();
            }
        });
    };

    const convertData = () => {
        setConverting(true);

        // Show loading toast
        const loadingToastId = toast.loading('Converting data...');

        router.post(
            '/migi/convert',
            {},
            {
                onSuccess: (page) => {
                    // Update loading toast to success
                    toast.update(loadingToastId, {
                        render: 'Data converted successfully!',
                        type: 'success',
                        isLoading: false,
                        autoClose: 3000,
                    });

                    setSuccess('Data converted successfully!');

                    // Refresh the page to update the DataTable
                    router.reload();
                },
                onError: (errors) => {
                    const errorMessage = errors.message || 'Failed to convert data. Please try again.';
                    setError(errorMessage);

                    // Update loading toast to error
                    toast.update(loadingToastId, {
                        render: errorMessage,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                    });
                },
                onFinish: () => {
                    setConverting(false);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="MIGI Management" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">MIGI Management</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                            Upload, manage, and convert MIGI (Material Issue Goods Issue) data.
                        </p>
                    </div>
                    <div className="mt-4 flex space-x-3 sm:mt-0 sm:ml-16">
                        <button
                            type="button"
                            onClick={() => setIsUploadModalOpen(true)}
                            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-800"
                        >
                            Upload Excel
                        </button>

                        {hasTemporaryData && (
                            <>
                                <button
                                    type="button"
                                    onClick={handleTruncateTable}
                                    disabled={truncating}
                                    className={`inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-800 ${
                                        truncating ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    {truncating ? 'Clearing...' : 'Clear Temporary Data'}
                                </button>

                                <button
                                    type="button"
                                    onClick={handleConvertData}
                                    disabled={converting}
                                    className={`inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-800 ${
                                        converting ? 'cursor-not-allowed opacity-50' : ''
                                    }`}
                                >
                                    {converting ? 'Converting...' : 'Convert Data'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* DataTable Component */}
                <div className="mt-8">
                    <MigiDataTable data={migis} onViewDetails={handleViewDetails} pending={pending} />
                </div>
            </div>

            {/* Upload Modal */}
            <Transition appear show={isUploadModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => !uploading && setIsUploadModalOpen(false)}>
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
                                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-gray-800">
                                    <div className="flex items-center justify-between">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                                            Upload Excel File
                                        </Dialog.Title>
                                        <button
                                            type="button"
                                            className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:text-gray-500 dark:ring-offset-gray-800 dark:hover:text-gray-400"
                                            onClick={() => !uploading && setIsUploadModalOpen(false)}
                                            disabled={uploading}
                                        >
                                            <span className="sr-only">Close</span>
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        </button>
                                    </div>

                                    {error && (
                                        <div className="mt-4 rounded-md bg-red-50 p-4 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="mt-4">
                                        <div className="mb-4">
                                            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Excel File
                                            </label>

                                            {/* Custom file input that works well in dark mode */}
                                            <div className="mt-1 flex flex-col space-y-2">
                                                <div className="flex items-center">
                                                    <label
                                                        htmlFor="file-upload"
                                                        className="cursor-pointer rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-800"
                                                    >
                                                        Browse Files
                                                    </label>
                                                    <span className="ml-3 max-w-xs truncate text-sm text-gray-500 dark:text-gray-400">
                                                        {fileName}
                                                    </span>
                                                </div>

                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept=".xlsx,.xls,.ods,.csv"
                                                    onChange={handleFileChange}
                                                    className="sr-only"
                                                />

                                                <p className="text-xs text-gray-500 dark:text-gray-400">Supported formats: .xlsx, .xls, .ods, .csv</p>
                                            </div>
                                        </div>

                                        <div className="mt-6 flex justify-end">
                                            <button
                                                type="button"
                                                className="mr-3 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                                onClick={() => !uploading && setIsUploadModalOpen(false)}
                                                disabled={uploading}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={uploading || !file}
                                                className={`inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none dark:ring-offset-gray-800 ${
                                                    uploading || !file ? 'cursor-not-allowed opacity-50' : ''
                                                }`}
                                            >
                                                {uploading ? 'Uploading...' : 'Upload'}
                                            </button>
                                        </div>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* Detail Modal Component */}
            <MigiDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                migi={selectedMigi}
                details={migiDetails}
                loading={loadingDetails}
            />

            {/* Toast container for notifications */}
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
