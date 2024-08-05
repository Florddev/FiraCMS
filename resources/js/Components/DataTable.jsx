import React, { useState, useEffect } from 'react'
import { Input } from '@/Components/ui/input'
import { useDebounce } from '@/Hooks/useDebounce'

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
    getSortedRowModel,
} from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table'
import { router } from '@inertiajs/react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/Components/ui/pagination"

export function DataTable({ columns, data, meta, initialFilters }) {
    const [sorting, setSorting] = useState(() => {
        if (initialFilters.sort) {
            return [{ id: initialFilters.sort, desc: initialFilters.direction === 'desc' }]
        }
        return []
    })
    const [searchTerm, setSearchTerm] = useState(initialFilters.search || '')
    const debouncedSearchTerm = useDebounce(searchTerm, 300)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        manualSorting: true,
        state: {
            sorting,
        },
    })

    useEffect(() => {
        router.get(route('users.index'), {
            search: debouncedSearchTerm,
            sort: sorting[0]?.id,
            direction: sorting[0]?.desc ? 'desc' : 'asc',
            page: 1, // Reset to first page on new search
        }, { preserveState: true })
    }, [debouncedSearchTerm, sorting])

    const handleSort = (column) => {
        const newSorting = sorting[0]?.id === column.id && sorting[0]?.desc
            ? []
            : [{ id: column.id, desc: sorting[0]?.id === column.id ? !sorting[0]?.desc : false }]
        setSorting(newSorting)
    }

    const handlePageChange = (page) => {
        router.get(route('users.index'), {
            page,
            sort: sorting[0]?.id,
            direction: sorting[0]?.desc ? 'desc' : 'asc',
        }, { preserveState: true })
    }

    const renderPaginationItems = () => {
        const items = []
        const totalPages = meta.last_page
        const currentPage = meta.current_page

        // Toujours afficher la première page
        items.push(
            <PaginationItem key="first">
                <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1} className="cursor-pointer">
                    1
                </PaginationLink>
            </PaginationItem>
        )

        // Ajouter des ellipses si nécessaire
        if (currentPage > 3) {
            items.push(<PaginationEllipsis key="ellipsis-start" />)
        }

        // Ajouter les pages autour de la page courante
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Ajouter des ellipses si nécessaire
        if (currentPage < totalPages - 2) {
            items.push(<PaginationEllipsis key="ellipsis-end" />)
        }

        // Toujours afficher la dernière page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    const test = (header) => {
        console.log(header);
        return header.column.columnDef.enableSorting ? "Oui" : "non";
    }

    return (
        <div>
            <div className="flex items-center pb-4">
                <Input
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: header.column.getCanSort() ? 'cursor-pointer select-none' : '',
                                                    onClick: header.column.getCanSort() ? () => handleSort(header.column) : undefined,
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {test(header)}
                                            </div>
                                        )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
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
            <div className="flex items-center justify-between space-x-2 py-4 w-full">
                <div>
                    Showing {meta.from} to {meta.to} of {meta.total} results
                </div>
                <Pagination className="w-auto">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => handlePageChange(meta.current_page - 1)}
                                disabled={!meta.prev_page_url}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                onClick={() => handlePageChange(meta.current_page + 1)}
                                disabled={!meta.next_page_url}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}
