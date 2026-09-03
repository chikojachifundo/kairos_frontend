
"use client";

import Link from "next/link";
import { ArrowRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <LockKeyhole className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-primary">
            Loan Manager
          </h1>

          <p className="mt-1 text-sm text-muted">
            Sign in to access your account
          </p>
        </div>

        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Welcome back
            </h2>

            <p className="mt-1 text-sm text-muted">
              Enter your credentials to continue.
            </p>
          </div>

          <form className="space-y-5">
            <FormField
              label="Email Address"
              htmlFor="email"
              required
            >
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <FormField
              label="Password"
              htmlFor="password"
              required
            >
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </FormField>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border"
                />
                Remember me
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button type="submit" className="w-full">
              Sign In
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 flex items-start gap-3 rounded-lg bg-primary/5 p-3">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <p className="text-xs leading-5 text-muted">
              Two-factor authentication may be required after
              signing in to keep your account secure.
            </p>
          </div>
        </Card>

        <p className="mt-6 text-center text-xs text-muted">
          © {new Date().getFullYear()} Loan Manager. All rights reserved.
        </p>
      </div>
    </div>
  );
}

