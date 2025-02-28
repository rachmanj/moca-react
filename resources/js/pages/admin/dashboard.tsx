import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AdminLayout from '@/layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth, stats }: { auth: any; stats: any }) {
    return (
        <AdminLayout user={auth.user} header={<h2 className="text-xl leading-tight font-semibold text-gray-800">Admin Dashboard</h2>}>
            <Head title="Admin Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Button asChild variant="outline" className="flex items-center">
                            <Link href={route('dashboard')}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mr-2 h-4 w-4"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Main Dashboard
                            </Link>
                        </Button>
                    </div>

                    <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Manage system users</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.users}</div>
                                <p className="text-sm text-gray-500">Total users in the system</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={route('users.index')}>Manage Users</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Roles</CardTitle>
                                <CardDescription>Manage user roles</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.roles}</div>
                                <p className="text-sm text-gray-500">Total roles defined</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={route('roles.index')}>Manage Roles</Link>
                                </Button>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Permissions</CardTitle>
                                <CardDescription>Manage permissions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stats.permissions}</div>
                                <p className="text-sm text-gray-500">Total permissions defined</p>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={route('permissions.index')}>Manage Permissions</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Button asChild variant="outline">
                                    <Link href={route('users.create')}>Create New User</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('roles.create')}>Create New Role</Link>
                                </Button>
                                <Button asChild variant="outline">
                                    <Link href={route('permissions.create')}>Create New Permission</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
