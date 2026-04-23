"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type KpiCardProps = {
    title: string;
    value: string | number;
    description?: string;
    icon?: React.ReactNode;
};

export default function KpiCard({
                                    title,
                                    value,
                                    description,
                                    icon,
                                }: KpiCardProps) {
    return (
        <Card className="hover:shadow-md transition">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>

            <CardContent>
                <div className="text-2xl font-bold">{value}</div>

                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}