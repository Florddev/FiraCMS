import React, {useCallback, useState} from 'react';
import LaravelDataTable from '@/Components/LaravelDataTable';
import axios from 'axios';
import {Button} from "@/Components/ui/button";

const UserTable = () => {
    const columns = [
        {
            accessorKey: "id",
            header: "ID",
            enableSorting: false,
        },
        {
            accessorKey: "name",
            header: "Name",
            enableSorting: true,
        },
        {
            accessorKey: "email",
            header: "Email",
            enableSorting: true,
            meta: {
                filter: {
                    options: [
                        { label: "florian.defay@gmail.com", value: "florian.defay@gmail.com" },
                    ],
                },
            },
        },
        {
            accessorKey: "created_at",
            header: "Created At",
            enableSorting: true,
            cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
        },
    ];

    const [selectedUserIds, setSelectedUserIds] = useState([]);


    const fetchData = useCallback(async ({ pagination, sorting, columnFilters, globalFilter, selectedIds }) => {
        try {
            const response = await axios.get('/api/datatable/users', {
                params: {
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                    sort: sorting.map(s => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','),
                    filters: JSON.stringify(columnFilters),
                    search: globalFilter,
                    selected_ids: selectedIds.join(','),
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return {
                data: [],
                pageCount: 0,
                total: 0,
            };
        }
    }, []);

    const handleSelectionChange = useCallback((selectedIds) => {
        setSelectedUserIds(selectedIds);
        console.log('Selected user IDs:', selectedIds);
    }, []);

    return (
        <div>
            <h1>User List</h1>
            {selectedUserIds.length > 0 && (
                <div>
                    {selectedUserIds.length} user(s) selected
                    <button onClick={() => { alert(selectedUserIds.join(', ')) }}>
                        Perform Action
                    </button>
                </div>
            )}
            <LaravelDataTable
                columns={columns}
                fetchData={fetchData}
                initialData={{
                    data: [],
                    current_page: 1,
                    per_page: 15,
                    total: 0,
                    last_page: 1,
                }}
                enableRowSelection={true}
                onSelectionChange={handleSelectionChange}
                selectionField="id"
            />
        </div>
    );
};

export default UserTable;
