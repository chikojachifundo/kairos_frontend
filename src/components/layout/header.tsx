"use client";

import { Bell, Menu } from "lucide-react";

interface HeaderProps {
    onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-white/95 px-4 backdrop-blur sm:px-6 lg:px-8">
            <button
                type="button"
                onClick={onMenuClick}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-muted hover:bg-surface-low hover:text-foreground lg:hidden"
                aria-label="Open navigation"
            >
                <Menu size={22} />
            </button>

            <div className="ml-auto flex items-center gap-3">
                <button
                    type="button"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted hover:bg-surface-low hover:text-foreground"
                    aria-label="Notifications"
                >
                    <Bell size={20} />

                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error" />
                </button>

                <div className="h-8 w-px bg-border" />

                <button
                    type="button"
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-surface-low"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        CC
                    </div>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold text-foreground">
                            Administrator
                        </p>
                        <p className="text-xs text-muted">
                            System Administrator
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
}