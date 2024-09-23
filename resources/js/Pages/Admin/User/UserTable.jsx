import React, {useCallback, useRef, useState} from 'react';
import LaravelDataTable from '@/Components/LaravelDataTable';
import {Button} from "@/Components/ui/button";
import axios from 'axios';
import {Avatar, AvatarFallback, AvatarImage} from "@/Components/ui/avatar";
import {Badge} from "@/Components/ui/badge";
import {ChevronRight, CircleUser, Ellipsis} from "lucide-react";
import {Link, usePage} from "@inertiajs/react";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/Components/ui/dropdown-menu";
import {CheckIcon, DotsHorizontalIcon} from "@radix-ui/react-icons";

const UserTable = () => {
    const { t, tChoice, currentLocale } = useLaravelReactI18n();

    const columns = [
        {
            accessorKey: "name",
            header: t('messages.account'),
            enableSorting: true,
            cell: ({row}) => (
                <div className="flex items-center gap-4">
                    <Avatar className="hidden h-9 w-9 sm:flex">
                        <AvatarImage src="/avatars/02.png" alt="Avatar" />
                        <AvatarFallback>{row.original.name.split(' ').slice(0, 2).map(word => word[0].toUpperCase()).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <p className="text-sm font-medium leading-none">{row.original.name}</p>
                        <p className="text-sm text-muted-foreground">{row.original.email}</p>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "roles",
            header: tChoice('messages.role', 2),
            enableSorting: false,
            meta: {
                filter: {
                    options: [
                        { label: "Administrateur", value: "Administrateur" },
                    ],
                },
            },
            cell: ({row})=>
                row.original.roles.length !== 0 && row.original.roles.map(role => (
                    <Badge key={role.id} variant="outline">{role.name}</Badge>
                ))
        },
        {
            accessorKey: "email_verified_at",
            header: t('messages.status'),
            enableSorting: true,
            meta: {
                filter: {
                    options: [
                        { label: "Verified", value: "verified" },
                        { label: "Unverified", value: "unverified" },
                    ],
                },
            },
            cell: ({row}) => (
                row.original.email_verified_at && (
                    <Badge variant="default" className="bg-green-200/40 text-green-500 font-normal">Vérifié</Badge>
                )
            ),
        },
        {
            accessorKey: "created_at",
            header: t('messages.created_at'),
            enableSorting: true,
            cell: ({ row }) => {
                const date = new Date(row.original.created_at);

                const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
                const optionsTime = { hour: '2-digit', minute: '2-digit' };

                const formattedDate = date.toLocaleDateString(usePage().props.locale, optionsDate);
                const formattedTime = date.toLocaleTimeString(usePage().props.locale, optionsTime);

                return `${formattedDate}, ${formattedTime}`
            },
            cellClassName: "w-52"
        },
        {
            header: tChoice('messages.action', 2),
            enableSorting: false,
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
                        >
                            <DotsHorizontalIcon className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Roles</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                Content
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Permissions</DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                Content
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            Delete
                            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
            headerClassName: "flex justify-end",
            cellClassName: "flex justify-end"
        },
    ];

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const dataTableRef = useRef();

    const fetchData = useCallback(async ({ pagination, sorting, columnFilters, globalFilter, selectedIds }) => {
        try {
            const response = await axios.get(route('users.get_users'), {
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
            {/*{selectedUserIds.length > 0 && (*/}
            {/*    <div>*/}
            {/*        {selectedUserIds.length} user(s) selected*/}
            {/*        <Button onClick={performAction}>Perform Action</Button>*/}
            {/*    </div>*/}
            {/*)}*/}
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
