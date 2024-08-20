import React, { useState, useEffect, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
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
import { Checkbox } from "@/Components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import TableSkeleton from "@/Components/TableSkeleton";
import {ArrowDownIcon, ArrowUpIcon, CaretSortIcon} from "@radix-ui/react-icons";

const LaravelDataTable = forwardRef(({
                                         columns,
                                         fetchData,
                                         initialData,
                                         enableRowSelection = false,
                                         onSelectionChange = () => {},
                                         selectionField = 'id',
                                        ...props
                                     }, ref) => {
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
    const [selectedRowIds, setSelectedRowIds] = useState(new Set());

    const debouncedGlobalFilter = useDebounce(globalFilter, 300);

    const selectedItems = useMemo(() => Array.from(selectedRowIds), [selectedRowIds]);

    const currentPageSelectedCount = useMemo(() => {
        return data.filter(row => selectedRowIds.has(row.id)).length;
    }, [data, selectedRowIds]);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedData = await fetchData({
                pagination,
                sorting,
                columnFilters,
                globalFilter: debouncedGlobalFilter,
                selectedIds: Array.from(selectedRowIds),
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
    }, [pagination, sorting, columnFilters, debouncedGlobalFilter, fetchData, isInitialLoad, selectedRowIds]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        onSelectionChange(selectedItems);
    }, [selectedItems, onSelectionChange]);

    const deselectAll = useCallback(() => {
        setSelectedRowIds(new Set());
    }, []);

    useImperativeHandle(ref, () => ({
        deselectAll
    }));

    const tableColumns = useMemo(() => {
        if (enableRowSelection) {
            return [
                {
                    id: 'select',
                    header: ({ table }) => (
                        <Checkbox
                            checked={data.length > 0 && data.every(row => selectedRowIds.has(row.id))}
                            onCheckedChange={(value) => {
                                setSelectedRowIds(prev => {
                                    const newSet = new Set(prev);
                                    data.forEach(row => {
                                        if (value) {
                                            newSet.add(row.id);
                                        } else {
                                            newSet.delete(row.id);
                                        }
                                    });
                                    return newSet;
                                });
                            }}
                            aria-label="Select all"
                        />
                    ),
                    cell: ({ row }) => (
                        <Checkbox
                            checked={selectedRowIds.has(row.original.id)}
                            onCheckedChange={(value) => {
                                setSelectedRowIds(prev => {
                                    const newSet = new Set(prev);
                                    if (value) {
                                        newSet.add(row.original.id);
                                    } else {
                                        newSet.delete(row.original.id);
                                    }
                                    return newSet;
                                });
                            }}
                            aria-label="Select row"
                        />
                    ),
                    enableSorting: false,
                    enableHiding: false,
                    cellClassName: "flex"
                },
                ...columns
            ];
        }
        return columns;
    }, [enableRowSelection, columns, selectedRowIds, data]);

    const table = useReactTable({
        data,
        columns: tableColumns,
        pageCount: pageCount,
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
        },
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
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
                deselectAll={deselectAll}
                selectedCount={selectedItems.length}
            />
            <div className="rounded-md border" {...props}>
                {isInitialLoad ? (
                    <TableSkeleton columns={tableColumns} rowCount={pagination.pageSize} />
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
                                                        className: (header.column.getCanSort()
                                                            ? 'cursor-pointer select-none flex items-center'
                                                            : '') + header.column.columnDef.headerClassName,
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                    {{
                                                        asc: <ArrowUpIcon className="ml-2 h-4 w-4" />,
                                                        desc: <ArrowDownIcon className="ml-2 h-4 w-4" />,
                                                    }[header.column.getIsSorted()] ?? (
                                                        header.column.getCanSort() && <CaretSortIcon className="ml-2 h-4 w-4" />
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
                                        data-state={selectedRowIds.has(row.original.id) && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id} className={cell.column.columnDef.cellClassName}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={tableColumns.length} className="h-24 text-center">
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                )}
            </div>
            <DataTablePagination
                table={table}
                totalSelectedCount={selectedItems.length}
                currentPageSelectedCount={currentPageSelectedCount}
                totalRowCount={data.length}
            />
        </div>
    );
});

export default LaravelDataTable;
