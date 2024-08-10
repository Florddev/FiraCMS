
import React from 'react';
import { usePage } from '@inertiajs/react';
import AppLayout from "@/Layouts/AppLayout.jsx";

export default function PluginComponent({ testProp, pluginData }) {
    const {locale, auth} = usePage().props;

    console.log('Toutes les props reçues:', usePage().props);
    console.log('Props spécifiques au plugin:', { testProp, pluginData });

    return (
        <AppLayout>
            <h1>Mon Nouveau Plugin</h1>
            <p>Test Prop: {testProp}</p>
            <p>Nom du plugin: {pluginData?.name}</p>
            <p>Version du plugin: {pluginData?.version}</p>
            <p>Locale actuelle: {locale}</p>
            <p>Utilisateur connecté: {auth?.user ? auth.user.name : 'Non connecté'}</p>
        </AppLayout>
    );
}
