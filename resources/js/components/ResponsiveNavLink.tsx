import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface ResponsiveNavLinkProps {
    href: string;
    active?: boolean;
    children: ReactNode;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    as?: string;
}

export default function ResponsiveNavLink({ href, active = false, children, method = 'get', as = 'a' }: ResponsiveNavLinkProps) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className={`block w-full border-l-4 py-2 pr-4 pl-3 text-left text-base font-medium transition duration-150 ease-in-out ${
                active
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700 focus:border-indigo-700 focus:bg-indigo-100 focus:text-indigo-800'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800 focus:border-gray-300 focus:bg-gray-50 focus:text-gray-800'
            }`}
        >
            {children}
        </Link>
    );
}
