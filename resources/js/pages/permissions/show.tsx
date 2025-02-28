import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, permission, roles }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Permission Details</h2>}>
            <Head title="Permission Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{permission.name}</CardTitle>
                                    <CardDescription>Permission ID: {permission.id}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-500">Guard Name</h3>
                                        <p className="mt-1">{permission.guard_name}</p>
                                    </div>

                                    <div>
                                        <h3 className="mb-2 text-sm font-medium text-gray-500">Assigned to Roles</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {roles.length > 0 ? (
                                                roles.map((role) => (
                                                    <Badge key={role.id} variant="secondary">
                                                        {role.name}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">Not assigned to any roles</p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href={route('permissions.index')}>Back to Permissions</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('permissions.edit', permission.id)}>Edit Permission</Link>
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
