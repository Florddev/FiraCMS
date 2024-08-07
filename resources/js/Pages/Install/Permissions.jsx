import React from 'react';
import { Link } from '@inertiajs/react';

export default function Permissions({ permissions }) {
    const allGranted = Object.values(permissions).every(Boolean);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Vérification des permissions</h1>
            <ul className="mb-4">
                {Object.entries(permissions).map(([path, isWritable]) => (
                    <li key={path} className={isWritable ? "text-green-500" : "text-red-500"}>
                        {path}: {isWritable ? "Accessible en écriture" : "Non accessible en écriture"}
                    </li>
                ))}
            </ul>
            {allGranted ? (
                <Link href={route('install.database')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Continuer
                </Link>
            ) : (
                <p className="text-red-500">Veuillez accorder les permissions nécessaires avant de continuer.</p>
            )}
        </div>
    );
}
