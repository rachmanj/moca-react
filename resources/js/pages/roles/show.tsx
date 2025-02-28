import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, role, permissions }) {
    // Group permissions by category
    const groupedPermissions = permissions.reduce((groups, permission) => {
        const parts = permission.name.split(' ');
        const resource = parts.slice(1).join(' '); // e.g., "users", "inventory", etc.

        if (!groups[resource]) {
            groups[resource] = [];
        }

        groups[resource].push(permission);

        return groups;
    }, {});

    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Role Details</h2>}>
            <Head title="Role Details" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="capitalize">{role.name}</CardTitle>
                                    <CardDescription>Role ID: {role.id}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <h3 className="mb-2 text-lg font-medium">Permissions</h3>
                                        {Object.keys(groupedPermissions).length > 0 ? (
                                            <div className="space-y-4">
                                                {Object.entries(groupedPermissions).map(([resource, perms]) => (
                                                    <div key={resource} className="space-y-2">
                                                        <h4 className="text-sm font-medium capitalize">{resource}</h4>
                                                        <div className="flex flex-wrap gap-2">
                                                            {perms.map((permission) => (
                                                                <Badge key={permission.id} variant="outline">
                                                                    {permission.name}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500">No permissions assigned to this role.</p>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button variant="outline" asChild>
                                        <Link href={route('roles.index')}>Back to Roles</Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={route('roles.edit', role.id)}>Edit Role</Link>
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
