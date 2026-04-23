"use client";

import { ReactNode } from "react";

export default function KpiGrid({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {children}
        </div>
    );
}