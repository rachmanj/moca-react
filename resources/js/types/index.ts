import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    url: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface FormDataType {
    [key: string]: any;
}

export interface LoginForm extends FormDataType {
    login: string;
    password: string;
    remember: boolean;
}

export interface RegisterForm extends FormDataType {
    name: string;
    username: string;
    email: string;
    project: string;
    department_id: string;
    password: string;
    password_confirmation: string;
}
