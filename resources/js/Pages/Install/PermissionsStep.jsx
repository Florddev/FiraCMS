import React from 'react';

export const PermissionsStep = ({ permissions }) => (
    <div className="my-4 p-4 border bg-secondary rounded-md">
        <h2 className="text-2xl font-bold mb-4">Vérification des permissions</h2>
        <ul>
            {Object.entries(permissions).map(([key, value]) => (
                <li key={key} className={`flex items-center ${value ? 'text-green-500' : 'text-red-500'}`}>
                    {value ? '✓' : '✗'} {key}
                </li>
            ))}
        </ul>
    </div>
);
