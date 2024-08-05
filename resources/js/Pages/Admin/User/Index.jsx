import React from 'react'
import { Head } from '@inertiajs/react'
import { DataTable } from '@/Components/DataTable'
import { columns } from './columns'
import AppLayout from '@/Layouts/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/Components/ui/card";
import {Button} from "@/Components/ui/button";
import {FileDown, Filter, FilterIcon, FilterX, ListFilter, Mail, UserPlus, UserPlus2} from "lucide-react";


export default function Index({ users, filters }) {
    return (
        <AppLayout current_page="users">
            <Head title="Users" />
            <h2 className="text-3xl font-extrabold tracking-tight">Gestion des utilisateurs</h2>

            <Tabs defaultValue="users" className="w-full">
                <TabsList className="my-4">
                    <TabsTrigger value="users">Utilisateurs</TabsTrigger>
                    <TabsTrigger value="roles">Rôles</TabsTrigger>
                    <TabsTrigger value="perms">Permissions</TabsTrigger>
                </TabsList>
                <TabsContent value="users" className="m-0">

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between">
                                <div className="flex flex-col">
                                    <CardTitle>Utilisateurs</CardTitle>
                                    <CardDescription>Deploy your new project in one-click.</CardDescription>
                                </div>
                                <div className="flex gap-1">
                                    <Button variant="outline" size="sm">
                                        <ListFilter className="mr-2 h-4 w-4" />
                                        Filtrer
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <FileDown className="mr-2 h-4 w-4" />
                                        Exporter
                                    </Button>
                                    <Button size="sm">
                                        <UserPlus2 className="mr-2 h-4 w-4" />
                                        Ajouter un utilisateur
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={columns}
                                data={users.data}
                                meta={users}
                                initialFilters={filters}
                            />
                        </CardContent>
                        {/*<CardFooter className="flex justify-between">*/}
                        {/*</CardFooter>*/}
                    </Card>

                </TabsContent>
                <TabsContent value="roles">Change your password here.</TabsContent>
                <TabsContent value="perms">Change permissions here.</TabsContent>
            </Tabs>

        </AppLayout>
    )
}
