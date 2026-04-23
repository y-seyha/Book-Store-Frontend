"use client";

import { ReactNode } from "react";

export default function DashboardGrid({
                                          children,
                                      }: {
    children: ReactNode;
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {children}
        </div>
    );
}