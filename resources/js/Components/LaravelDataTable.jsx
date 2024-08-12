import React, { useState, useEffect, useCallback } from 'react';
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
} from "@tanstack/react-table";
import { DataTablePagination } from "@/Components/DataTablePagination";
import { DataTableToolbar } from "@/Components/DataTableToolbar";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import { useDebounce } from "@/Hooks/useDebounce.js";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import TableSkeleton from "@/Components/TableSkeleton";

const LaravelDataTable = ({ columns, fetchData, initialData, onInitialLoadComplete }) => {
    const [data, setData] = useState(initialData.data);
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: initialData.perPage || 10,
    });
    const [pageCount, setPageCount] = useState(initialData.pageCount || 1);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const debouncedGlobalFilter = useDebounce(globalFilter, 300);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedData = await fetchData({
                pagination,
                sorting,
                columnFilters,
                globalFilter: debouncedGlobalFilter,
            });
            setData(fetchedData.data);
            setPageCount(fetchedData.pageCount);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
            if (isInitialLoad) {
                setIsInitialLoad(false);
            }
        }
    }, [pagination, sorting, columnFilters, debouncedGlobalFilter, fetchData, isInitialLoad]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (!isInitialLoad && onInitialLoadComplete) {
            onInitialLoadComplete();
        }
    }, [isInitialLoad, onInitialLoadComplete]);

    const handlePaginationChange = useCallback((newPagination) => {
        setPagination(newPagination);
        loadData();
    }, [loadData]);

    const table = useReactTable({
        data,
        columns,
        pageCount: pageCount,
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
        },
        onPaginationChange: handlePaginationChange,
        onSortingChange: (updatedSorting) => {
            setSorting(updatedSorting);
            setPagination(prev => ({ ...prev, pageIndex: 0 }));
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    return (
        <div className="space-y-4">
            <DataTableToolbar
                table={table}
                globalFilter={globalFilter}
                onGlobalFilterChange={setGlobalFilter}
                isInitialLoad={isInitialLoad}
            />
            <div className="rounded-md border">
                {isInitialLoad ? (
                    <TableSkeleton columns={columns} rowCount={pagination.pageSize} />
                ) : (
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none flex items-center'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ArrowUp className="ml-2 h-4 w-4" />,
                                                        desc: <ArrowDown className="ml-2 h-4 w-4" />,
                                                    }[header.column.getIsSorted()] ?? (
                                                        header.column.getCanSort() && <ArrowUpDown className="ml-2 h-4 w-4" />
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <DataTablePagination table={table} />
        </div>
    );
};

export default LaravelDataTable;
