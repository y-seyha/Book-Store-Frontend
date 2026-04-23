"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Product = {
    productId: number;
    name: string;
    totalSold: number | string;
};

type Props = {
    items: Product[];
};

export default function TopProductsCard({ items }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm text-muted-foreground">
                    Top Products
                </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
                {items.map((p, index) => (
                    <div
                        key={p.productId}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {index + 1}. {p.name}
                        </span>

                        <span className="font-medium">
                            {p.totalSold} sold
                        </span>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}