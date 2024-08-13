import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Input } from "@/Components/ui/input"
import { Button } from "@/Components/ui/button"
import { Label } from "@/Components/ui/label"

export default function PermissionCreate({ errors }) {
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('permissions.store'), { name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-bold">Create New Permission</h2>

            <div>
                <Label htmlFor="permission-name">Permission Name</Label>
                <Input
                    id="permission-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                {errors?.name && (
                    <p className="text-destructive">{errors.name}</p>
                )}
            </div>

            <Button type="submit">Create Permission</Button>
        </form>
    );
}
