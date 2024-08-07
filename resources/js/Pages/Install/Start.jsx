import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

export default function Start() {
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        setLoading(true);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Bienvenue dans l'installation du CMS</h1>
            <p className="mb-4">Cliquez sur le bouton ci-dessous pour commencer l'installation.</p>
            <Link href={route('install.requirements')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleClick}>
                {loading ? 'Chargement...' : 'Commencer l\'installation'}
            </Link>
        </div>
    );
}
