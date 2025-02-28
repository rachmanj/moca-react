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
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

interface Permission {
    id: string;
    name: string;
    guard_name: string;
}

interface User {
    name: string;
    email: string;
}

interface PageProps {
    auth: {
        user: User;
    };
    permissions: Permission[];
}

export default function Index({ auth, permissions }: PageProps) {
    const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null);

    const handleDelete = () => {
        if (permissionToDelete) {
            router.delete(route('permissions.destroy', permissionToDelete));
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Permissions</h2>}>
            <Head title="Permissions" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:border dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">Permission Management</h3>
                                <Link href={route('permissions.create')}>
                                    <Button>Create Permission</Button>
                                </Link>
                            </div>

                            <Table>
                                <TableCaption>A list of all permissions.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Guard</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {permissions.map((permission: any) => (
                                        <TableRow key={permission.id}>
                                            <TableCell className="font-medium">{permission.name}</TableCell>
                                            <TableCell>{permission.guard_name}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('permissions.show', permission.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('permissions.edit', permission.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => setPermissionToDelete(permission.id)}
                                                            >
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    This action cannot be undone. This will permanently delete the permission and
                                                                    remove it from all roles.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setPermissionToDelete(null)}>
                                                                    Cancel
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
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
