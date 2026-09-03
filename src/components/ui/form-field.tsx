import type { ReactNode } from "react";

interface FormFieldProps {
    label: string;
    htmlFor?: string;
    required?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
}

export function FormField({
                              label,
                              htmlFor,
                              required = false,
                              error,
                              hint,
                              children,
                          }: FormFieldProps) {
    return (
        <div className="space-y-1.5">
            <label
                htmlFor={htmlFor}
                className="text-sm font-medium text-foreground"
            >
                {label}

                {required && (
                    <span className="ml-1 text-error">*</span>
                )}
            </label>

            {children}

            {hint && !error && (
                <p className="text-xs text-muted">{hint}</p>
            )}

            {error && (
                <p className="text-xs text-error">{error}</p>
            )}
        </div>
    );
}