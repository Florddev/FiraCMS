import React, {useCallback, useRef, useState} from 'react';
import LaravelDataTable from '@/Components/LaravelDataTable';
import axios from 'axios';
import {Button} from "@/Components/ui/button";

const UserTable = () => {
    const columns = [
        // {
        //     accessorKey: "id",
        //     header: "ID",
        //     enableSorting: false,
        // },
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
    const dataTableRef = useRef();

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

    const performAction = async () => {
        try {
            alert(selectedUserIds.join(', '))

            // Après l'action réussie, désélectionner toutes les lignes
            dataTableRef.current.deselectAll();

            // Optionnel : Afficher un message de succès ou rafraîchir les données
            console.log('Action performed successfully');
        } catch (error) {
            console.error('Error performing action:', error);
            // Gérer l'erreur (par exemple, afficher un message d'erreur)
        }
    };

    return (
        <div>
            {selectedUserIds.length > 0 && (
                <div>
                    {selectedUserIds.length} user(s) selected
                    <Button onClick={performAction}>Perform Action</Button>
                </div>
            )}
            <LaravelDataTable
                ref={dataTableRef}
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
                className="border-0"
            />
        </div>
    );
};

export default UserTable;
