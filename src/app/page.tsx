
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Client Management",
    description:
      "Manage clients, groups, contact information and loan relationships from one place.",
  },
  {
    icon: WalletCards,
    title: "Loan Management",
    description:
      "Manage loan applications, disbursements, repayments and outstanding balances.",
  },
  {
    icon: BarChart3,
    title: "Reports & Analytics",
    description:
      "Get clear insights into your loan portfolio and operational performance.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Protect your organization's data with secure authentication and two-factor verification.",
  },
];

const highlights = [
  "Centralized client records",
  "Branch-based operations",
  "Loan portfolio management",
  "Repayment tracking",
  "Operational reporting",
  "Role-based access",
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-surface">
      {/* Navigation */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <WalletCards className="h-5 w-5" />
            </div>

            <span className="text-lg font-bold text-primary">
              Loan Manager
            </span>
          </Link>

          <Link href="/login">
            <Button size="sm">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-surface-low">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Loan management platform
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
              Manage your lending operations with confidence.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-muted sm:text-lg">
              A centralized platform for managing clients, branches,
              loans, repayments and portfolio performance.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/login">
                <Button size="lg">
                  Access Loan Manager
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Button
                type="button"
                variant="outline"
                size="lg"
              >
                Explore Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Platform capabilities
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
              Everything you need to manage your lending operations.
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Keep your lending operations organized with a
              centralized system designed for financial teams.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="rounded-xl border border-border bg-surface p-5"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-foreground">
                    {feature.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-surface-low">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-secondary">
              Built for your operations
            </p>

            <h2 className="mt-2 text-2xl font-bold text-primary sm:text-3xl">
              One platform for your entire loan lifecycle.
            </h2>

            <p className="mt-4 text-sm leading-6 text-muted">
              From client registration through loan servicing and
              reporting, keep your lending information organized
              and accessible.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex"
            >
              <Button>
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {highlights.map((highlight) => (
              <div
                key={highlight}
                className="flex items-center gap-3 rounded-lg border border-border bg-surface p-4"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />

                <span className="text-sm text-foreground">
                  {highlight}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <ClipboardList className="mx-auto h-8 w-8 text-white" />

          <h2 className="mt-4 text-2xl font-bold text-white">
            Ready to manage your lending operations?
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/70">
            Sign in to access your loan management workspace.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex"
          >
            <Button
              variant="secondary"
              size="lg"
            >
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-center text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Loan Manager. All rights reserved.
          </p>

          <div className="flex justify-center gap-4">
            <span>Secure</span>
            <span>Reliable</span>
            <span>Built for lending operations</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

