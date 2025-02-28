import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

interface MigiDetailRecord {
    id: number;
    item_code: string;
    desc: string;
    qty: number;
    project_code: string;
    document_number: string;
    document_date: string;
    wo_number: string;
    unit_number: string;
}

interface OldcoreReceiptRecord {
    id: number;
    receipt_number: string;
    migi_detail_id?: number | null;
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

interface EditReceiptProps {
    receipt: OldcoreReceiptRecord;
    migiDetails: MigiDetailRecord[];
}

export default function EditReceipt({ receipt, migiDetails }: EditReceiptProps) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Oldcores',
            href: '/oldcores',
        },
        {
            title: 'Edit Receipt',
            href: route('oldcores.receipts.edit', receipt.id),
        },
    ];

    const { data, setData, put, processing, errors } = useForm({
        receipt_number: receipt.receipt_number || '',
        date: receipt.date || '',
        migi_detail_id: receipt.migi_detail_id?.toString() || '',
        item_code: receipt.item_code || '',
        desc: receipt.desc || '',
        qty: receipt.qty?.toString() || '0',
        weight_total: receipt.weight_total?.toString() || '0',
        project: receipt.project || '',
        remarks: receipt.remarks || '',
        given_by: receipt.given_by || '',
        received_by: receipt.received_by || '',
    });

    const [filteredMigiDetails, setFilteredMigiDetails] = useState<MigiDetailRecord[]>([]);
    const [selectedMigiDetail, setSelectedMigiDetail] = useState<MigiDetailRecord | null>(null);

    // Filter migi details based on selected project
    useEffect(() => {
        if (data.project) {
            const filtered = migiDetails.filter((detail) => detail.project_code === data.project);
            setFilteredMigiDetails(filtered);
        } else {
            setFilteredMigiDetails([]);
        }
    }, [data.project, migiDetails]);

    // Update form data when a migi detail is selected
    useEffect(() => {
        if (data.migi_detail_id) {
            const selected = migiDetails.find((detail) => detail.id.toString() === data.migi_detail_id);
            if (selected) {
                setSelectedMigiDetail(selected);
                setData({
                    ...data,
                    item_code: selected.item_code,
                    desc: selected.desc,
                    project: selected.project_code,
                });
            }
        }
    }, [data.migi_detail_id]);

    // Get unique project codes for dropdown
    const uniqueProjectCodes = [...new Set(migiDetails.map((detail) => detail.project_code))];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form data:', data);

        // Create a new object with the converted values
        const formData = {
            receipt_number: data.receipt_number,
            date: data.date,
            migi_detail_id: data.migi_detail_id,
            item_code: data.item_code,
            desc: data.desc,
            qty: parseFloat(data.qty as string) || 0,
            weight_total: parseFloat(data.weight_total as string) || 0,
            project: data.project,
            remarks: data.remarks,
            given_by: data.given_by,
            received_by: data.received_by,
        };

        console.log('Converted form data for submission:', formData);

        // Update the form data with the converted values
        Object.entries(formData).forEach(([key, value]) => {
            setData(key as any, value);
        });

        put(route('oldcores.receipts.update', receipt.id), {
            onSuccess: () => {
                console.log('Form submitted successfully');
                toast.success('Receipt updated successfully');
            },
            onError: (errors: Record<string, string>) => {
                console.error('Form submission errors:', errors);
                toast.error('Failed to update receipt');
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Edit Oldcore Receipt" />

            <div className="px-4 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center">
                    <div className="sm:flex-auto">
                        <Link
                            href={route('oldcores.index')}
                            className="mb-4 inline-flex items-center text-sm font-medium text-indigo-400 hover:text-indigo-300"
                        >
                            <ArrowLeftIcon className="mr-1 h-4 w-4" />
                            Back to Oldcores
                        </Link>
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Oldcore Receipt</h1>
                        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">Update the details of an existing oldcore receipt.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                    <Card className="p-6">
                        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="receipt_number">Receipt Number</Label>
                                <Input
                                    id="receipt_number"
                                    name="receipt_number"
                                    value={data.receipt_number}
                                    onChange={(e) => setData('receipt_number', e.target.value)}
                                />
                                {errors.receipt_number && <p className="text-sm text-red-500">{errors.receipt_number}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date">Receipt Date *</Label>
                                <Input
                                    type="date"
                                    id="date"
                                    name="date"
                                    value={data.date}
                                    onChange={(e) => setData('date', e.target.value)}
                                    required
                                />
                                {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="project">Project *</Label>
                                <Select value={data.project} onValueChange={(value) => setData('project', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Project" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {uniqueProjectCodes.map((code) => (
                                                <SelectItem key={code} value={code}>
                                                    {code}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.project && <p className="text-sm text-red-500">{errors.project}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="migi_detail_id">Select MIGI Detail (Optional)</Label>
                                <Select value={data.migi_detail_id} onValueChange={(value) => setData('migi_detail_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select MIGI Detail (Optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            {filteredMigiDetails.map((detail) => (
                                                <SelectItem key={detail.id.toString()} value={detail.id.toString()}>
                                                    {detail.document_number} - {detail.item_code} - {detail.desc.substring(0, 30)}...
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.migi_detail_id && <p className="text-sm text-red-500">{errors.migi_detail_id}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="item_code">Item Code *</Label>
                                <Input
                                    id="item_code"
                                    name="item_code"
                                    value={data.item_code}
                                    onChange={(e) => setData('item_code', e.target.value)}
                                    required
                                />
                                {errors.item_code && <p className="text-sm text-red-500">{errors.item_code}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="qty">Quantity *</Label>
                                <Input
                                    type="number"
                                    id="qty"
                                    name="qty"
                                    value={data.qty}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('qty', e.target.value === '' ? '' : e.target.value)}
                                    min="1"
                                    step="1"
                                    required
                                />
                                {errors.qty && <p className="text-sm text-red-500">{errors.qty}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="weight_total">Weight Total *</Label>
                                <Input
                                    type="number"
                                    id="weight_total"
                                    name="weight_total"
                                    value={data.weight_total}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        setData('weight_total', e.target.value === '' ? '' : e.target.value)
                                    }
                                    min="0.01"
                                    step="0.01"
                                    required
                                />
                                {errors.weight_total && <p className="text-sm text-red-500">{errors.weight_total}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="given_by">Given By</Label>
                                <Input id="given_by" name="given_by" value={data.given_by} onChange={(e) => setData('given_by', e.target.value)} />
                                {errors.given_by && <p className="text-sm text-red-500">{errors.given_by}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="received_by">Received By *</Label>
                                <Input
                                    id="received_by"
                                    name="received_by"
                                    value={data.received_by}
                                    onChange={(e) => setData('received_by', e.target.value)}
                                    required
                                />
                                {errors.received_by && <p className="text-sm text-red-500">{errors.received_by}</p>}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="desc">Description *</Label>
                                <Textarea
                                    id="desc"
                                    name="desc"
                                    value={data.desc}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('desc', e.target.value)}
                                    rows={3}
                                    required
                                />
                                {errors.desc && <p className="text-sm text-red-500">{errors.desc}</p>}
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="remarks">Remarks</Label>
                                <Textarea
                                    id="remarks"
                                    name="remarks"
                                    value={data.remarks}
                                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('remarks', e.target.value)}
                                    rows={2}
                                />
                                {errors.remarks && <p className="text-sm text-red-500">{errors.remarks}</p>}
                            </div>
                        </div>
                    </Card>

                    <div className="flex justify-end space-x-3">
                        <Button variant="outline" type="button" onClick={() => (window.location.href = route('oldcores.index'))}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Receipt'}
                        </Button>
                    </div>
                </form>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme="colored" />
        </AppLayout>
    );
}
