"use client";

import {getStatusMessage} from "@/lib/utils";

type DeliveryStatus =
    | "preparing"
    | "picked_up"
    | "on_the_way"
    | "delivered"
    | "cancelled";

export function Stepper({ status }: { status?: DeliveryStatus }) {
    const steps: DeliveryStatus[] = [
        "preparing",
        "picked_up",
        "on_the_way",
        "delivered",
    ];

    const currentIndex = steps.indexOf(status || "preparing");

    return (
        <div className="space-y-4">
            {/* Stepper */}
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const isDone = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step} className="flex-1 flex items-center">
                            <div
                                className={`
                  w-8 h-8 flex items-center justify-center rounded-full text-xs font-medium
                  ${isDone && "bg-green-500 text-white"}
                  ${isCurrent && "bg-primary text-primary-foreground animate-pulse"}
                  ${!isDone && !isCurrent && "bg-muted text-muted-foreground"}
                `}
                            >
                                {isDone ? "✓" : isCurrent ? "●" : ""}
                            </div>

                            {index !== steps.length - 1 && (
                                <div className="flex-1 h-[2px] bg-border mx-2" />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Labels */}
            <div className="flex justify-between text-xs text-muted-foreground">
                <span>Preparing</span>
                <span>Picked</span>
                <span>On Way</span>
                <span>Delivered</span>
            </div>

            {/* Message */}
            <div className="text-sm text-muted-foreground">
                {getStatusMessage(status)}
            </div>
        </div>
    );
}