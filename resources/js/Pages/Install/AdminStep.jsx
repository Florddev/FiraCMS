import React from 'react';
import {Input} from "@/Components/ui/input";
import {PasswordInput} from "@/Components/ui/input-password";

export const AdminStep = ({ data, setData, errors }) => (
    <div className="my-4 p-4 border bg-secondary rounded-md">
        <h2 className="text-2xl font-bold mb-4">Création du compte administrateur</h2>
        <div className="space-y-4">
            <Input type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder="Nom"
            />
            {errors.name ?? (<span>{errors.name}</span>)}
            <Input type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                placeholder="Email"
            />
            {errors.email ?? (<span>{errors.email}</span>)}
            <PasswordInput
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                placeholder="Mot de passe"
            />
            {errors.password ?? (<span>{errors.password}</span>)}
            <PasswordInput
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                placeholder="Confirmation du mot de passe"
            />
            {errors.password_confirmation ?? (<span>{errors.password_confirmation}</span>)}
        </div>
    </div>
);
