import AdminLayout from '@/layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import PermissionForm from './PermissionForm';

export default function Edit({ auth, permission }: { auth: any; permission: any }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit Permission</h2>}>
            <Head title="Edit Permission" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <PermissionForm permission={permission} submitLabel="Update Permission" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
