import React from 'react';
import { X } from "lucide-react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { DataTableViewOptions } from "@/Components/DataTableViewOptions";
import { DataTableFacetedFilter } from "@/Components/DataTableFacetedFilter";

export function DataTableToolbar({
    table,
    globalFilter,
    onGlobalFilterChange,
    deselectAll,
    selectedCount
}) {
    const isFiltered = table.getState().columnFilters.length > 0 || globalFilter !== '';

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Search all columns..."
                    value={globalFilter}
                    onChange={(event) => onGlobalFilterChange(event.target.value)}
                    className="h-8 w-[150px] lg:w-[250px]"
                />
                {table.getAllColumns().map((column) => {
                    if (column.columnDef.meta?.filter) {
                        return (
                            <DataTableFacetedFilter
                                key={column.id}
                                column={column}
                                title={column.columnDef.header}
                                options={column.columnDef.meta.filter.options}
                            />
                        );
                    }
                    return null;
                })}
                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => {
                            table.resetColumnFilters();
                            onGlobalFilterChange('');
                        }}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <div className="flex items-center space-x-2">
                {selectedCount > 0 && (
                    <Button
                        variant="destructive"
                        onClick={deselectAll}
                        className="h-8 px-2 lg:px-3"
                    >
                        Deselect All ({selectedCount})
                    </Button>
                )}
                <DataTableViewOptions table={table} />
            </div>
        </div>
    );
}
