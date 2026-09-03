
"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FormField } from "@/components/ui/form-field";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <Mail className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-primary">
            Forgot your password?
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Enter your email address and we'll send you
            instructions to reset your password.
          </p>
        </div>

        <Card className="p-6">
          <form className="space-y-5">
            <FormField
              label="Email Address"
              htmlFor="email"
              required
              hint="Use the email address associated with your account."
            >
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </FormField>

            <Button type="submit" className="w-full">
              Send Reset Link
              <Send className="h-4 w-4" />
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

