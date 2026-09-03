import { AppShell } from "@/components/layout/app-shell";

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export default function DashboardLayout({
                                            children,
                                        }: DashboardLayoutProps) {
    return <AppShell>{children}</AppShell>;
}