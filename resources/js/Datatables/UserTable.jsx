import React from 'react';
import LaravelDataTable from '@/Components/LaravelDataTable';
import axios from 'axios';

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

    const fetchData = async ({ pagination, sorting, columnFilters, globalFilter }) => {
        try {
            const response = await axios.get('/api/datatable/users', {
                params: {
                    page: pagination.pageIndex + 1,
                    per_page: pagination.pageSize,
                    sort: sorting.map(s => `${s.id}:${s.desc ? 'desc' : 'asc'}`).join(','),
                    filters: JSON.stringify(columnFilters),
                    search: globalFilter,
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
    };

    return (
        <div>
            <h1>User List</h1>
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
            />
        </div>
    );
};

export default UserTable;
