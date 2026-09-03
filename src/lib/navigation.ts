import {
    BarChart3,
    ClipboardList,
    FileBarChart,
    LayoutDashboard,
    LogOut,
    Receipt,
    Settings,
    ShieldCheck,
    Users,
    WalletCards,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavigationItem {
    title: string;
    href: string;
    icon: LucideIcon;
}

export const mainNavigation: NavigationItem[] = [
    {
        title: "Branches",
        href: "/branches",
        icon: LayoutDashboard,
    },
    {
        title: "Groups",
        href: "/groups",
        icon: Users,
    },
    {
        title: "Clients",
        href: "/clients",
        icon: Users,
    },
    {
        title: "Disbursements",
        href: "/disbursements",
        icon: WalletCards,
    },
    {
        title: "LoanBook",
        href: "/loanbook",
        icon: ClipboardList,
    },
    {
        title: "Receipts",
        href: "/receipts",
        icon: Receipt,
    },
    {
        title: "Analytics",
        href: "/analytics",
        icon: BarChart3,
    },
    {
        title: "Reports",
        href: "/reports",
        icon: FileBarChart,
    },
    {
        title: "User Management",
        href: "/user-management",
        icon: ShieldCheck,
    },
];

export const footerNavigation: NavigationItem[] = [
    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },
    {
        title: "Logout",
        href: "/logout",
        icon: LogOut,
    },
];