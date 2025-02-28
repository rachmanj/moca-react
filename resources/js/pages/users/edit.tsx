import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';
import UserForm from './UserForm';

export default function Edit({ auth, user, roles, userRoles }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Edit User</h2>}>
            <Head title="Edit User" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <UserForm user={user} roles={roles} userRoles={userRoles} submitLabel="Update User" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
