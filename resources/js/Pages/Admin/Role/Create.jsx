import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"
import { Checkbox } from "@/Components/ui/checkbox"

export default function RoleCreate({ allPermissions, errors }) {
    const [name, setName] = useState('');
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('roles.store'), { name, permissions: selectedPermissions });
    };

    const handlePermissionChange = (permissionName) => {
        setSelectedPermissions(prev =>
            prev.includes(permissionName) ? prev.filter(p => p !== permissionName) : [...prev, permissionName]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Create New Role</h2>

            <div>
                <Label htmlFor="role-name">Role Name</Label>
                <Input
                    id="role-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {errors?.name && (
                    <p className="text-destructive">{errors.name}</p>
                )}
            </div>

            <div>
                <h3 className="text-lg font-semibold">Permissions</h3>
                {allPermissions && allPermissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`permission-${permission.id}`}
                            checked={selectedPermissions.includes(permission.name)}
                            onCheckedChange={() => handlePermissionChange(permission.name)}
                        />
                        <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
                    </div>
                ))}
            </div>

            <Button type="submit">Create Role</Button>
        </form>
    );
}
