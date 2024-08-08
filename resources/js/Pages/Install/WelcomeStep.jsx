import React from 'react';

export const WelcomeStep = () => (
    <div className="my-4 p-4 border bg-secondary rounded-md">
        <h2 className="text-2xl font-bold mb-4">Bienvenue dans l'installation de votre CMS</h2>
        <p>Ce processus vous guidera à travers les étapes nécessaires pour configurer votre CMS. Assurez-vous d'avoir les informations suivantes à portée de main :</p>
        <ul className="list-disc list-inside mt-2">
            <li>Les détails de connexion à votre base de données</li>
            <li>Les informations pour créer un compte administrateur</li>
        </ul>
        <p className="mt-4">Cliquez sur "Suivant" pour commencer.</p>
    </div>
);
