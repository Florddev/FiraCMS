import React from 'react';
import {Input} from "@/Components/ui/input";

export const DatabaseStep = ({ data, setData, errors }) => (
    <div className="my-4 p-4 border bg-secondary rounded-md">
        <h2 className="text-2xl font-bold mb-4">Configuration de la base de données</h2>
        <div className="space-y-4">
            <Input
                type="text"
                value={data.db_host}
                onChange={(e) => setData('db_host', e.target.value)}
                placeholder="Hôte"
                error={errors.db_host}
            />
            <Input
                type="text"
                value={data.db_port}
                onChange={(e) => setData('db_port', e.target.value)}
                placeholder="Port"
                error={errors.db_port}
            />
            <Input
                type="text"
                value={data.db_database}
                onChange={(e) => setData('db_database', e.target.value)}
                placeholder="Nom de la base de données"
                error={errors.db_database}
            />
            <Input
                type="text"
                value={data.db_username}
                onChange={(e) => setData('db_username', e.target.value)}
                placeholder="Nom d'utilisateur"
                error={errors.db_username}
            />
            <Input
                type="password"
                value={data.db_password}
                onChange={(e) => setData('db_password', e.target.value)}
                placeholder="Mot de passe"
                error={errors.db_password}
            />
        </div>
    </div>
);
