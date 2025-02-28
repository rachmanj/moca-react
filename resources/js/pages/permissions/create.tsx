import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import PermissionForm from './PermissionForm';

export default function Create({ auth }: { auth: any }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Create Permission</h2>}>
            <Head title="Create Permission" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <PermissionForm submitLabel="Create Permission" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
