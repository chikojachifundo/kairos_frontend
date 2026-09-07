import type { Metadata } from "next";

import { FeedbackProvider } from "@/components/providers/feedback-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Loan Manager",
  description: "Loan Management System",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body>
      <FeedbackProvider>
        {children}
      </FeedbackProvider>
      </body>
      </html>
  );
}