"use client";

import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table";

type Column<T> = {
    key: string;
    title: string;
    render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
    columns: Column<T>[];
    data: T[];
};

export default function DataTable<T>({
                                         columns,
                                         data,
                                     }: DataTableProps<T>) {
    return (
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((col) => (
                            <TableHead key={col.key}>{col.title}</TableHead>
                        ))}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={(row as any).id}>
                            {columns.map((col) => (
                                <TableCell key={col.key}>
                                    {col.render
                                        ? col.render(row)
                                        : (row as any)[col.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}