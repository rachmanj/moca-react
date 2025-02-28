import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, user, roles, permissions }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">User Details</h2>}>
            <Head title="User Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{user.name}</CardTitle>
                                    <CardDescription>{user.email}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Username</h3>
                                            <p className="mt-1">{user.username}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Project</h3>
                                            <p className="mt-1">{user.project}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Department ID</h3>
                                            <p className="mt-1">{user.department_id || 'Not assigned'}</p>
                                        </div>
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                                            <p className="mt-1">{new Date(user.created_at).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-sm font-medium text-gray-500">Roles</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {roles.length > 0 ? (
                                                roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary">
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No roles assigned</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-sm font-medium text-gray-500">Permissions</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {permissions.length > 0 ? (
                                                permissions.map((permission) => (
                                                    <Badge key={permission.id} variant="outline">
                                                        {permission.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No permissions</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href={route('users.index')}>Back to Users</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('users.edit', user.id)}>Edit User</Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
