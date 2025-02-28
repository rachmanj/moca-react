import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import RoleForm from './RoleForm';

export default function Edit({ auth, role, permissions, rolePermissions }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit Role</h2>}>
            <Head title="Edit Role" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <RoleForm role={role} permissions={permissions} rolePermissions={rolePermissions} submitLabel="Update Role" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
