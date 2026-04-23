"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type InsightCardProps = {
    title: string;
    value: string;
    icon?: React.ReactNode;
    color?: string;
};

export default function InsightCard({
                                        title,
                                        value,
                                        icon,
                                    }: InsightCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm text-muted-foreground">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>

            <CardContent>
                <div className="text-lg font-semibold">{value}</div>
            </CardContent>
        </Card>
    );
}