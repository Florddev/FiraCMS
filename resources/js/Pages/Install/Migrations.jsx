import React from 'react';
import { router } from '@inertiajs/react';

export default function Migrations() {
    const runMigrations = () => {
        router.post(route('install.runMigrations'));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Exécution des migrations</h1>
            <p className="mb-4">Cliquez sur le bouton ci-dessous pour exécuter les migrations de la base de données.</p>
            <button onClick={runMigrations} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Exécuter les migrations
            </button>
        </div>
    );
}
