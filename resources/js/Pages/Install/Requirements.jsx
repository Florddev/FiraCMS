import React from 'react';
import { Link } from '@inertiajs/react';

export default function Requirements({ requirements }) {
    const allMet = Object.values(requirements).every(Boolean);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Vérification des prérequis</h1>
            <ul className="mb-4">
                {Object.entries(requirements).map(([req, met]) => (
                    <li key={req} className={met ? "text-green-500" : "text-red-500"}>
                        {req}: {met ? "OK" : "Non satisfait"}
                    </li>
                ))}
            </ul>
            {allMet ? (
                <Link href={route('install.permissions')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Continuer
                </Link>
            ) : (
                <p className="text-red-500">Veuillez satisfaire tous les prérequis avant de continuer.</p>
            )}
        </div>
    );
}
