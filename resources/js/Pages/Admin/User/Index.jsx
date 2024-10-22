import React, {useState} from 'react';
import UserTable from '@/Pages/Admin/User/UserTable';
import AppLayout from "@/Layouts/AppLayout";
import {User, UserCog, Users} from "lucide-react";
import {useLaravelReactI18n} from "laravel-react-i18n";
import {Head} from "@inertiajs/react";
import {AddUserDialog} from "@/Pages/Admin/User/Components/AddUserDialog";

const UsersIndex = () => {
    const { t, tChoice } = useLaravelReactI18n();

    return (
        <AppLayout current_page="users" title={t('messages.user_management')}>
            <div className="space-y-2 border-b px-4 pt-8 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
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
                    </div>
                    <div className="flex items-center space-x-2">
                        <AddUserDialog/>
                    </div>
                </div>
                <div className="text-sm font-medium text-center">
                    <ul className="flex flex-wrap -mb-px items-end">
                        <li className="me-2">
                            <a href="#" className="text-foreground font-normal inline-block py-2 border-b-2 border-primary rounded-t-lg group" aria-current="page">
                                <span className="px-2 py-1 flex items-center gap-1 rounded-md group-hover:bg-muted/80">
                                    <Users className="w-4 h-4"/>
                                    { tChoice('messages.user', 2) }
                                </span>
                            </a>
                        </li>
                        <li className="me-2">
                            <a href="#" className="text-muted-foreground font-normal inline-block py-2 border-b-2 border-transparent rounded-t-lg hover:text-foreground group">
                                <span className="px-2 py-1 flex items-center gap-1 rounded-md group-hover:bg-muted/80">
                                    <UserCog className="w-4 h-4"/>
                                    { tChoice('messages.role', 2) }
                                </span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="p-4 lg:px-8">
                <UserTable />
            </div>
        </AppLayout>
    );
};

export default UsersIndex;
