export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavItem {
    title: string;
    url: string;
    icon?: any;
}

export interface NavGroup {
    group: string;
    items: NavItem[];
}
