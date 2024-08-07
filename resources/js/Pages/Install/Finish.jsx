import React from 'react';
import { Link } from '@inertiajs/react';

export default function Finish() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Installation terminée</h1>
            <p className="mb-4">Félicitations ! L'installation de votre CMS est terminée.</p>
            <Link href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Aller à la page d'accueil
            </Link>
        </div>
    );
}
