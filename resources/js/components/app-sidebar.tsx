import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder,Shield, Settings, LayoutGrid } from 'lucide-react';
import { usePage } from '@inertiajs/react';

import AppLogo from './app-logo';


export function AppSidebar() {
const {auth} = usePage().props;
const user = auth?.user;
const userRole = user?.role || 'user';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
];

const adminNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin/dashboard',
        icon: Shield,
    },
];

const workerNavItems: NavItem[] = [
    {
        title: 'Worker Dashboard',
        href: '/worker/dashboard',
        icon: Settings,
    },
];


let roleBasedNavItems = [...mainNavItems];

if(userRole === 'admin') {
    roleBasedNavItems=[...roleBasedNavItems, ...adminNavItems,...workerNavItems];
}

if(userRole === 'worker') {
    roleBasedNavItems=[...roleBasedNavItems, ...workerNavItems];
}


const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];


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
                <NavMain items={roleBasedNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
