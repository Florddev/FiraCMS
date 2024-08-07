import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';

export default function Database() {
    const { data, setData, post, processing, errors } = useForm({
        db_host: '',
        db_port: '',
        db_database: '',
        db_username: '',
        db_password: '',
    });

    const [isFormValid, setIsFormValid] = useState(false);
    useEffect(() => {
        setIsFormValid(
            data.db_host !== '' &&
            data.db_port !== '' &&
            data.db_database !== '' &&
            data.db_username !== '' &&
            data.db_password !== ''
        );
    }, [data]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('install.setDatabase'));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Configuration de la base de données</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Hôte</label>
                    <input type="text" value={data.db_host} onChange={e => setData('db_host', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.db_host && <div className="text-red-500">{errors.db_host}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Port</label>
                    <input type="number" value={data.db_port} onChange={e => setData('db_port', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.db_port && <div className="text-red-500">{errors.db_port}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Nom de la base de données</label>
                    <input type="text" value={data.db_database} onChange={e => setData('db_database', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.db_database && <div className="text-red-500">{errors.db_database}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Utilisateur</label>
                    <input type="text" value={data.db_username} onChange={e => setData('db_username', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.db_username && <div className="text-red-500">{errors.db_username}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Mot de passe</label>
                    <input type="password" value={data.db_password} onChange={e => setData('db_password', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.db_password && <div className="text-red-500">{errors.db_password}</div>}
                </div>
                <button type="submit" disabled={processing || !isFormValid} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    {processing ? 'Configuration en cours...' : 'Configurer la base de données'}
                </button>
            </form>
        </div>
    );
}
