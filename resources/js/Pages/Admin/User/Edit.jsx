import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Checkbox } from "@/Components/ui/checkbox"
import { Button } from "@/Components/ui/button"

export default function Edit({ user, allRoles, allPermissions }) {
    const [roles, setRoles] = useState(user.roles.map(role => role.name));
    const [permissions, setPermissions] = useState(user.permissions.map(permission => permission.name));

    const handleSubmit = (e) => {
        e.preventDefault();
        router.put(route('users.update', user.id), { roles, permissions });
    };

    const handleRoleChange = (roleName) => {
        setRoles(prev =>
            prev.includes(roleName) ? prev.filter(r => r !== roleName) : [...prev, roleName]
        );
    };

    const handlePermissionChange = (permissionName) => {
        setPermissions(prev =>
            prev.includes(permissionName) ? prev.filter(p => p !== permissionName) : [...prev, permissionName]
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Edit User: {user.name}</h2>

            <div>
                <h3 className="text-lg font-semibold">Roles</h3>
                {allRoles.map(role => (
                    <div key={role.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`role-${role.id}`}
                            checked={roles.includes(role.name)}
                            onCheckedChange={() => handleRoleChange(role.name)}
                        />
                        <label htmlFor={`role-${role.id}`}>{role.name}</label>
                    </div>
                ))}
            </div>

            <div>
                <h3 className="text-lg font-semibold">Permissions</h3>
                {allPermissions.map(permission => (
                    <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                            id={`permission-${permission.id}`}
                            checked={permissions.includes(permission.name)}
                            onCheckedChange={() => handlePermissionChange(permission.name)}
                        />
                        <label htmlFor={`permission-${permission.id}`}>{permission.name}</label>
                    </div>
                ))}
            </div>

            <Button type="submit">Update User</Button>
        </form>
    );
}
