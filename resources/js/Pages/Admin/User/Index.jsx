import React, {useState} from 'react';
import UserTable from '@/Pages/Admin/User/UserTable';
import AppLayout from "@/Layouts/AppLayout";
import {Button} from "@/Components/ui/button";
import {ArrowUpRight, ChevronsUpDown, Edit, X} from "lucide-react";
import {useLaravelReactI18n} from "laravel-react-i18n";
import FetchingCombobox from "@/Components/ComboboxComponent";
import {Badge} from "@/Components/ui/badge";
import {Avatar, AvatarFallback, AvatarImage} from "@/Components/ui/avatar";
import {Head} from "@inertiajs/react";

const UsersIndex = () => {
    const { t, tChoice } = useLaravelReactI18n();

    return (
        <AppLayout current_page="users">
            <Head title={t('messages.user_management')}/>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{t('messages.user_management')}</h2>
                        <p className="text-muted-foreground pb-3">
                            Manage your team members add their account permissions here.

                            {/*
                            <FetchingCombobox
                                apiUrl="/api/datatable/users/test"
                                placeholder="Sélectionner des utilisateurs"
                                idField="id"
                                onSelect={(users) => console.log('Utilisateurs sélectionnés:', users)}
                                multiple={true}
                                renderItem={(user, isSelected) => (
                                    <div className={`flex items-center gap-4 px-2 py-1`}>
                                        <Avatar>
                                            <AvatarImage alt="@shadcn" />
                                            <AvatarFallback>{user.id}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div>{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                )}
                                renderSelected={(user, onRemove) => (
                                    <Badge key={user.id} variant="outline" className="flex items-center gap-2">
                                        <Avatar className="w-4 h-4">
                                            <AvatarImage alt="@shadcn" />
                                            <AvatarFallback>{user.id}</AvatarFallback>
                                        </Avatar>
                                        <span>{user.name}</span>
                                        {onRemove && <X className="h-3 w-3 cursor-pointer" onClick={onRemove} />}
                                    </Badge>
                                )}
                                selectedPosition="top"
                            />
                            */}

                        </p>


                        <div className="text-sm font-medium text-center border-b dark:text-gray-400 dark:border-gray-700">
                            <ul className="flex flex-wrap -mb-px items-center">
                                <li className="me-2">
                                    <a href="#" className="text-foreground inline-block py-3.5 border-b-2 border-primary rounded-t-lg group" aria-current="page">
                                        <span className="px-3 py-1.5 rounded-md group-hover:bg-muted/80">All users</span>
                                    </a>
                                </li>
                                <li className="me-2">
                                    <a href="#" className="text-muted-foreground inline-block py-3.5 border-b-2 border-transparent rounded-t-lg hover:text-foreground group">
                                        <span className="px-3 py-1.5 rounded-md group-hover:bg-muted/80">Roles</span>
                                    </a>
                                </li>
                                <li className="me-2">
                                    <a href="#" className="text-muted-foreground inline-block py-3.5 border-b-2 border-transparent rounded-t-lg hover:text-foreground group">
                                        <span className="px-3 py-1.5 rounded-md group-hover:bg-muted/80">Permissions</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                    </div>
                    <div className="flex items-center space-x-2">
                        <Button size="sm">
                            {t('messages.add_user')}
                            <ArrowUpRight className="ml-2 w-4 h-4"></ArrowUpRight>
                        </Button>
                    </div>
                </div>
                <UserTable />
            </div>
        </AppLayout>
    );
};

export default UsersIndex;
