import { Link } from '@inertiajs/react';
import { ReactNode } from 'react';

interface NavLinkProps {
    href: string;
    active: boolean;
    children: ReactNode;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    as?: string;
}

export default function NavLink({ href, active, children, method = 'get', as = 'a' }: NavLinkProps) {
    return (
        <Link
            href={href}
            method={method}
            as={as}
            className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm leading-5 font-medium transition duration-150 ease-in-out focus:outline-none ${
                active
                    ? 'border-indigo-400 text-gray-900 focus:border-indigo-700'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 focus:border-gray-300 focus:text-gray-700'
            }`}
        >
            {children}
        </Link>
    );
}
