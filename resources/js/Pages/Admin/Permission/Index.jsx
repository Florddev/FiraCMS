import React from 'react';
import { Link } from '@inertiajs/react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table"
import { Button } from "@/Components/ui/button"

export default function PermissionList({ permissions }) {
    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Permissions</h1>
                <Button asChild>
                    <Link href={route('permissions.create')}>Create New Permission</Link>
                </Button>
            </div>
            <Table>
                <TableCaption>List of permissions</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission) => (
                        <TableRow key={permission.id}>
                            <TableCell>{permission.name}</TableCell>
                            <TableCell>
                                <Button asChild className="mr-2">
                                    <Link href={route('permissions.edit', permission.id)}>Edit</Link>
                                </Button>
                                <Button variant="destructive" onClick={() => handleDelete(permission.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

function handleDelete(id) {
    // Implement delete logic here
    if (confirm('Are you sure you want to delete this permission?')) {
        Inertia.delete(route('permissions.destroy', id));
    }
}
