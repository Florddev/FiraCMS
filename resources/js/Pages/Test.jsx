import React from 'react';
import UserTable from '@/Datatables/UserTable';
import AppLayout from "@/Layouts/AppLayout.jsx";

const App = () => {
    return (
        <AppLayout>
            <h1>Admin Dashboard</h1>
            <UserTable />
        </AppLayout>
    );
};

export default App;
