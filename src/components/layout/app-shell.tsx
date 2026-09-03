"use client";

import { useEffect, useState } from "react";

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleToggle = () => {
            setCollapsed((current) => !current);
        };

        window.addEventListener(
            "toggle-sidebar",
            handleToggle
        );

        return () => {
            window.removeEventListener(
                "toggle-sidebar",
                handleToggle
            );
        };
    }, []);

    return (
        <div className="min-h-screen bg-background">
            <div className="flex min-h-screen">
                <Sidebar
                    collapsed={collapsed}
                    mobileOpen={mobileOpen}
                    onCloseMobile={() => setMobileOpen(false)}
                />

                <div className="flex min-w-0 flex-1 flex-col">
                    <Header
                        onMenuClick={() =>
                            setMobileOpen(true)
                        }
                    />

                    <main className="flex-1 p-4 sm:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}