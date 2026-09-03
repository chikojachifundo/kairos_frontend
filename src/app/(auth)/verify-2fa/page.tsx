
"use client";

import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function VerifyTwoFactorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h1 className="mt-4 text-2xl font-bold text-primary">
            Verify your identity
          </h1>

          <p className="mt-2 text-sm leading-6 text-muted">
            Enter the six-digit verification code sent to
            your registered device.
          </p>
        </div>

        <Card className="p-6">
          <div className="text-center">
            <p className="text-sm text-muted">
              Verification code
            </p>
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <Input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="h-12 w-11 px-0 text-center text-lg font-semibold"
                aria-label={`Verification digit ${index + 1}`}
              />
            ))}
          </div>

          <Button type="button" className="mt-6 w-full">
            Verify Code
          </Button>

          <div className="mt-5 text-center">
            <p className="text-xs text-muted">
              Didn't receive a code?
            </p>

            <button
              type="button"
              className="mt-1 text-sm font-medium text-primary hover:underline"
            >
              Resend code
            </button>
          </div>

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

