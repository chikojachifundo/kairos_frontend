"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {ChevronLeft, Plus, WalletCards} from "lucide-react";

import {
    footerNavigation,
    mainNavigation,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
    collapsed: boolean;
    mobileOpen: boolean;
    onCloseMobile: () => void;
}

export function Sidebar({
                            collapsed,
                            mobileOpen,
                            onCloseMobile,
                        }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname === href || pathname.startsWith(`${href}/`);
    };

    return (
        <>
            {mobileOpen && (
                <button
                    type="button"
                    aria-label="Close navigation"
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                    onClick={onCloseMobile}
                />
            )}

            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-white transition-transform duration-200 lg:static lg:z-auto lg:translate-x-0",
                    collapsed && "lg:w-20",
                    mobileOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                )}
            >
                {/* Logo */}
                <div
                    className={cn(
                        "flex h-20 items-center border-b border-border px-5",
                        collapsed && "lg:justify-center lg:px-2"
                    )}
                >
                    <Link
                        href="/clients"
                        className="flex items-center gap-3"
                        onClick={onCloseMobile}
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white">
                            <WalletCards size={21} />
                        </div>

                        {!collapsed && (
                            <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-foreground">
                  LendFlow
                </span>
                                <span className="text-xs text-muted">
                  Lending Management
                </span>
                            </div>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
                    <nav className="flex-1 space-y-1 px-3 py-5">
                        {mainNavigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onCloseMobile}
                                    title={collapsed ? item.title : undefined}
                                    className={cn(
                                        "group flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary text-white"
                                            : "text-muted hover:bg-surface-low hover:text-foreground",
                                        collapsed && "lg:justify-center lg:px-2"
                                    )}
                                >
                                    <Icon
                                        size={19}
                                        strokeWidth={1.9}
                                        className="shrink-0"
                                    />

                                    {!collapsed && (
                                        <span className="truncate">{item.title}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* New Loan */}
                    <div
                        className={cn(
                            "px-3 pb-4",
                            collapsed && "lg:flex lg:justify-center"
                        )}
                    >
                        <Link
                            href="/disbursements/new"
                            onClick={onCloseMobile}
                            title={collapsed ? "New Loan" : undefined}
                            className={cn(
                                "flex items-center justify-center gap-2 rounded-lg bg-secondary-container px-4 py-3 text-sm font-bold text-foreground transition-opacity hover:opacity-90",
                                collapsed && "lg:h-11 lg:w-11 lg:p-0"
                            )}
                        >
                            <Plus size={18} />

                            {!collapsed && <span>New Loan</span>}
                        </Link>
                    </div>

                    {/* Footer Navigation */}
                    <div className="border-t border-border px-3 py-4">
                        {footerNavigation.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={onCloseMobile}
                                    title={collapsed ? item.title : undefined}
                                    className={cn(
                                        "mb-1 flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
                                        active
                                            ? "bg-primary text-white"
                                            : "text-muted hover:bg-surface-low hover:text-foreground",
                                        collapsed && "lg:justify-center lg:px-2"
                                    )}
                                >
                                    <Icon size={19} />

                                    {!collapsed && <span>{item.title}</span>}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Desktop collapse button */}
                <button
                    type="button"
                    onClick={() => {
                        // The parent controls desktop collapse.
                        window.dispatchEvent(new CustomEvent("toggle-sidebar"));
                    }}
                    className="absolute -right-3 top-24 hidden h-7 w-7 items-center justify-center rounded-full border border-border bg-white text-muted shadow-sm hover:text-foreground lg:flex"
                    aria-label="Toggle sidebar"
                >
                    <ChevronLeft
                        size={15}
                        className={cn(
                            collapsed && "rotate-180"
                        )}
                    />
                </button>
            </aside>
        </>
    );
}