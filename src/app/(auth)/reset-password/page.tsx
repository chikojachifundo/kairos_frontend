
"use client";

import Link from "next/link";
import { ArrowLeft, KeyRound, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <KeyRound className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-primary">
            Reset your password
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Create a new password for your account.
          </p>
        </div>

        <Card className="p-6">
          <form className="space-y-5">
            <FormField
              label="New Password"
              htmlFor="password"
              required
            >
              <Input
                id="password"
                type="password"
                placeholder="Enter new password"
                autoComplete="new-password"
              />
            </FormField>

            <FormField
              label="Confirm Password"
              htmlFor="password_confirmation"
              required
            >
              <Input
                id="password_confirmation"
                type="password"
                placeholder="Confirm new password"
                autoComplete="new-password"
              />
            </FormField>

            <div className="rounded-lg bg-surface-low p-3">
              <p className="text-xs font-medium text-foreground">
                Password requirements
              </p>

              <ul className="mt-2 space-y-1 text-xs text-muted">
                <li>• At least 8 characters</li>
                <li>• Include uppercase and lowercase letters</li>
                <li>• Include at least one number</li>
                <li>• Include at least one special character</li>
              </ul>
            </div>

            <Button type="submit" className="w-full">
              Reset Password
              <Save className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 border-t border-border pt-5 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to login
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

