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
    id: string;
    name: string;
}

interface User {
    id: string;
    name: string;
    username: string;
    email: string;
    roles: Role[];
}

interface PageProps {
    auth: {
        user: User;
    };
    users: User[];
}

export default function Index({ auth, users }: PageProps) {
    const [userToDelete, setUserToDelete] = useState<string | null>(null);

    const handleDelete = () => {
        if (userToDelete) {
            router.delete(route('users.destroy', userToDelete));
        }
    };

    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800 dark:text-gray-200">Users</h2>}>
            <Head title="Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:border dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="mb-6 flex items-center justify-between">
                                <h3 className="text-lg font-medium">User Management</h3>
                                <Link href={route('users.create')}>
                                    <Button>Create User</Button>
                                </Link>
                            </div>

                            <Table>
                                <TableCaption>A list of all users.</TableCaption>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Roles</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {user.roles.map((role) => (
                                                        <Badge key={role.id} variant="outline">
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={route('users.show', user.id)}>
                                                        <Button variant="outline" size="sm">
                                                            View
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('users.edit', user.id)}>
                                                        <Button variant="outline" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                    {auth.user.id !== user.id && (
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button variant="destructive" size="sm" onClick={() => setUserToDelete(user.id)}>
                                                                    Delete
                                                                </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                    <AlertDialogDescription>
                                                                        This action cannot be undone. This will permanently delete the user account
                                                                        and remove their data from our servers.
                                                                    </AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
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
