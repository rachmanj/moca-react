import { Link } from '@inertiajs/react';
import { CircleHelp } from 'lucide-react';

import { MainNavItems } from '@/components/main-nav-items';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';
import AppLogo from './app-logo';

const footerNavItems = [
    {
        title: 'Need Help?',
        url: 'https://github.com/laravel/react-starter-kit',
        icon: CircleHelp,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                {MainNavItems.map((navGroup: NavGroup) => (
                    <NavMain key={navGroup.group} title={navGroup.group} items={navGroup.items} />
                ))}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
