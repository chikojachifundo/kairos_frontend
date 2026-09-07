"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
} from "lucide-react";

import { cn } from "@/lib/utils";

export type FeedbackType =
    | "success"
    | "error"
    | "warning"
    | "info";

interface FeedbackState {
    type: FeedbackType;
    title: string;
    message?: string;
}

interface FeedbackContextType {
    feedback: FeedbackState | null;

    showFeedback: (
        type: FeedbackType,
        title: string,
        message?: string,
    ) => void;

    closeFeedback: () => void;
}

const FeedbackContext =
    createContext<FeedbackContextType | undefined>(
        undefined,
    );

interface FeedbackProviderProps {
    children: ReactNode;
}

export function FeedbackProvider({
                                     children,
                                 }: FeedbackProviderProps) {
    const [feedback, setFeedback] =
        useState<FeedbackState | null>(null);

    const showFeedback = useCallback(
        (
            type: FeedbackType,
            title: string,
            message?: string,
        ) => {
            setFeedback({
                type,
                title,
                message,
            });
        },
        [],
    );

    const closeFeedback = useCallback(() => {
        setFeedback(null);
    }, []);

    return (
        <FeedbackContext.Provider
            value={{
                feedback,
                showFeedback,
                closeFeedback,
            }}
        >
            {children}

            {feedback && (
                <div className="fixed left-1/2 top-5 z-[100] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2">
                    <FeedbackBar
                        type={feedback.type}
                        title={feedback.title}
                        message={feedback.message}
                        onClose={closeFeedback}
                    />
                </div>
            )}
        </FeedbackContext.Provider>
    );
}

export function useFeedback() {
    const context = useContext(FeedbackContext);

    if (!context) {
        throw new Error(
            "useFeedback must be used inside a FeedbackProvider",
        );
    }

    return context;
}

interface FeedbackBarProps {
    type?: FeedbackType;
    title: string;
    message?: string;
    duration?: number;
    onClose: () => void;
}

export function FeedbackBar({
                                type = "success",
                                title,
                                message,
                                duration = 120000,
                                onClose,
                            }: FeedbackBarProps) {
    useEffect(() => {
        if (!duration) return;

        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const config = {
        success: {
            icon: CheckCircle2,
            container:
                "border-green-200 bg-green-50 text-green-800",
            iconColor: "text-green-600",
        },

        error: {
            icon: XCircle,
            container:
                "border-red-200 bg-red-50 text-red-800",
            iconColor: "text-red-600",
        },

        warning: {
            icon: AlertTriangle,
            container:
                "border-amber-200 bg-amber-50 text-amber-800",
            iconColor: "text-amber-600",
        },

        info: {
            icon: Info,
            container:
                "border-blue-200 bg-blue-50 text-blue-800",
            iconColor: "text-blue-600",
        },
    };

    const {
        icon: Icon,
        container,
        iconColor,
    } = config[type];

    return (
        <div
            role="alert"
            className={cn(
                "flex items-start gap-3 rounded-lg border px-4 py-3",
                "bg-surface shadow-lg",
                "animate-in fade-in slide-in-from-top-2",
                container,
            )}
        >
            <Icon
                className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    iconColor,
                )}
            />

            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">
                    {title}
                </p>

                {message && (
                    <p className="mt-0.5 text-xs opacity-90">
                        {message}
                    </p>
                )}
            </div>

            <button
                type="button"
                onClick={onClose}
                className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}