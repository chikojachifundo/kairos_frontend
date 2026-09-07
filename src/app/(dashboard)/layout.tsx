import { AppShell } from "@/components/layout/app-shell";
import { FeedbackProvider } from "@/components/ui/feedback-bar";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <FeedbackProvider>
            <AppShell>
                {children}
            </AppShell>
        </FeedbackProvider>
    );
}