import { cn } from "@/lib/utils";

interface SeparatorProps {
    orientation?: "horizontal" | "vertical";
    className?: string;
}

export function Separator({
                              orientation = "horizontal",
                              className,
                          }: SeparatorProps) {
    return (
        <div
            className={cn(
                orientation === "horizontal"
                    ? "w-full h-px bg-border"
                    : "h-full w-px bg-border",
                className
            )}
        />
    );
}