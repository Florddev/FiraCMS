import React from 'react';
import { Skeleton } from "@/Components/ui/skeleton";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

const TableSkeleton = ({ columns, rowCount = 5 }) => {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {columns.map((column, index) => (
                        <TableHead key={index}>
                            <Skeleton className="h-6 w-full" />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {[...Array(rowCount)].map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {columns.map((column, cellIndex) => (
                            <TableCell key={cellIndex} className="p-3.5">
                                <Skeleton className="h-6 w-full" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default TableSkeleton;
