import React from 'react';
import {Input} from "@/Components/ui/input";

export const AdminStep = ({ data, setData, errors }) => (
    <div className="my-4 p-4 border bg-secondary rounded-md">
        <h2 className="text-2xl font-bold mb-4">Création du compte administrateur</h2>
        <div className="space-y-4">
            <Input
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nom"
                error={errors.name}
            />
            <Input
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Email"
                error={errors.email}
            />
            <Input
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Mot de passe"
                error={errors.password}
            />
            <Input
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Confirmation du mot de passe"
                error={errors.password_confirmation}
            />
        </div>
    </div>
);
