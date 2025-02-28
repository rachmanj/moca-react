import AppLogo from '@/components/app-logo';
import NavLink from '@/components/NavLink';
import ResponsiveNavLink from '@/components/ResponsiveNavLink';
import { ThemeToggle } from '@/components/theme-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface User {
    name: string;
    email: string;
}

interface CustomPageProps extends InertiaPageProps {
    auth: {
        user: User;
    };
}

export default function AdminLayout({ user, header, children }: { user: any; header: any; children: any }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const { auth } = usePage<CustomPageProps>().props;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <AppLogo />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ml-10 sm:flex">
                                <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                    Admin Dashboard
                                </NavLink>
                                <NavLink href={route('users.index')} active={route().current('users.*')}>
                                    Users
                                </NavLink>
                                <NavLink href={route('roles.index')} active={route().current('roles.*')}>
                                    Roles
                                </NavLink>
                                <NavLink href={route('permissions.index')} active={route().current('permissions.*')}>
                                    Permissions
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <ThemeToggle />
                            <div className="relative ml-3">
                                <DropdownMenu>
                                    <DropdownMenuTrigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm leading-4 font-medium text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none dark:bg-gray-800 dark:text-gray-300 dark:hover:text-gray-100"
                                            >
                                                {auth.user.name}

                                                <svg
                                                    className="-mr-0.5 ml-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent>
                                        <DropdownMenuItem>
                                            <Link href={route('profile.edit')} className="w-full">
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Link href={route('logout')} method="post" as="button" className="w-full text-left">
                                                Log Out
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        <div className="-mr-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden'}>
                    <div className="space-y-1 pt-2 pb-3">
                        <ResponsiveNavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                            Admin Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('users.index')} active={route().current('users.*')}>
                            Users
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('roles.index')} active={route().current('roles.*')}>
                            Roles
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('permissions.index')} active={route().current('permissions.*')}>
                            Permissions
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Main Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pt-4 pb-1">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">{auth.user.name}</div>
                            <div className="text-sm font-medium text-gray-500">{auth.user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button">
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 dark:shadow-gray-700/10">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main className="dark:text-gray-200">{children}</main>
        </div>
    );
}
