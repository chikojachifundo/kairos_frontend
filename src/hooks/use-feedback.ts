"use client";

import { useCallback, useState } from "react";

import type { FeedbackType } from "@/components/ui/feedback-bar";

interface FeedbackState {
    type: FeedbackType;
    title: string;
    message?: string;
}

export function useFeedback() {
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

    return {
        feedback,
        showFeedback,
        closeFeedback,
    };
}