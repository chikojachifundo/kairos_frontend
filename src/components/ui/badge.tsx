import { cn } from "@/lib/utils";

type BadgeVariant =
    | "success"
    | "danger"
    | "warning"
    | "neutral";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    dot?: boolean;
}

export function Badge({
                          children,
                          variant = "neutral",
                          className,
                          dot = true,
                      }: BadgeProps) {
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
                "text-xs font-medium",

                variant === "success" &&
                "bg-green-100 text-green-700",

                variant === "danger" &&
                "bg-red-100 text-red-700",

                variant === "warning" &&
                "bg-amber-100 text-amber-700",

                variant === "neutral" &&
                "bg-slate-100 text-slate-700",

                className,
            )}
        >
      {dot && (
          <span
              className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  variant === "success" && "bg-green-600",
                  variant === "danger" && "bg-red-600",
                  variant === "warning" && "bg-amber-600",
                  variant === "neutral" && "bg-slate-500",
              )}
          />
      )}

            {children}
    </span>
    );
}