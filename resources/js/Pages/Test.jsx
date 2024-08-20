import React from 'react';
import UserTable from '@/Pages/Admin/User/UserTable.jsx';
import AppLayout from "@/Layouts/AppLayout";
import {Button} from "@/Components/ui/button";
import {ArrowUpRight} from "lucide-react";

const App = () => {
    return (
        <AppLayout>
            <div className="hidden h-full flex-1 flex-col space-y-8 md:flex">
                <div className="flex items-center justify-between space-y-2">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">User management</h2>
                        <p className="text-muted-foreground">
                            Here&apos;s a list of your tasks for this month!
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button size="sm">
                            Ajouter un utilisateur
                            <ArrowUpRight className="ml-2 w-4 h-4"></ArrowUpRight>
                        </Button>
                    </div>
                </div>
                <UserTable />
            </div>
        </AppLayout>
    );
};

export default App;
