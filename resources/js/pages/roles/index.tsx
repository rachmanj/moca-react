import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
    permissions: Permission[];
}

interface Permission {
    id: number;
    name: string;
}

interface PageProps {
    auth: {
        user: any;
    };
    roles: Role[];
}

export default function Index({ auth, roles }: PageProps) {
    const [roleToDelete, setRoleToDelete] = useState<number | null>(null);

    const handleDelete = () => {
        if (roleToDelete) {
            router.delete(route('roles.destroy', roleToDelete));
        }
    };

    const isSystemRole = (roleName: string) => {
        return ['superadmin', 'admin'].includes(roleName);
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Roles</h2>}>
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:border dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Role Management</h3>
                                <Link href={route('roles.create')}>
                                    <Button>Create Role</Button>
                                </Link>
                            </div>

                            <Table>
                                <TableCaption>A list of all roles.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Permissions</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {roles.map((role) => (
                                        <TableRow key={role.id}>
                                            <TableCell className="font-medium">
                                                {role.name}
                                                {isSystemRole(role.name) && (
                                                    <Badge className="ml-2" variant="secondary">
                                                        System
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.slice(0, 5).map((permission) => (
                                                        <Badge key={permission.id} variant="outline">
                                                            {permission.name}
                                                        </Badge>
                                                    ))}
                                                    {role.permissions.length > 5 && (
                                                        <Badge variant="outline">+{role.permissions.length - 5} more</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('roles.show', role.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('roles.edit', role.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    {!isSystemRole(role.name) && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm" onClick={() => setRoleToDelete(role.id)}>
                                                                    Delete
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the role and remove
                                                                        it from all users.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel onClick={() => setRoleToDelete(null)}>
                                                                        Cancel
                                                                    </AlertDialogCancel>
                                                                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
