import React from 'react';
import { useForm } from '@inertiajs/react';

export default function Admin() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('install.createAdmin'));
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Création du compte administrateur</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-2">Nom</label>
                    <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.name && <div className="text-red-500">{errors.name}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Email</label>
                    <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.email && <div className="text-red-500">{errors.email}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Mot de passe</label>
                    <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} className="w-full p-2 border rounded" />
                    {errors.password && <div className="text-red-500">{errors.password}</div>}
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Confirmation du mot de passe</label>
                    <input type="password" value={data.password_confirmation} onChange={e => setData('password_confirmation', e.target.value)} className="w-full p-2 border rounded" />
                </div>
                <button type="submit" disabled={processing} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Créer le compte administrateur
                </button>
            </form>
        </div>
    );
}
