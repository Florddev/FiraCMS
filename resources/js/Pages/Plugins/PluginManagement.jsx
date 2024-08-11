import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Switch } from '@/Components/ui/switch';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/Components/ui/alert';
import AppLayout from "@/Layouts/AppLayout.jsx";

const PluginCard = ({ plugin, onToggle }) => {
    const [isEnabled, setIsEnabled] = useState(plugin.enabled);

    const handleToggle = () => {
        setIsEnabled(!isEnabled);
        onToggle(plugin.id, !isEnabled);
    };

    return (
        <Card className="mb-4">
            <CardHeader>
                <CardTitle>{plugin.name}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between">
                    <span>Status: {isEnabled ? 'Enabled' : 'Disabled'}</span>
                    <Switch
                        checked={isEnabled}
                        onCheckedChange={handleToggle}
                    />
                </div>
                <p className="mt-2 text-sm text-gray-600">Directory: {plugin.directory}</p>
            </CardContent>
        </Card>
    );
};

const PluginList = ({ plugins }) => {
    const { flash } = usePage().props;

    const handleToggle = (pluginId, newStatus) => {
        router.post(route('plugins.toggle', pluginId), {
            enabled: newStatus
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Plugin Management</h1>

            {flash?.message && (
                <Alert className="mb-4" variant={flash.type === 'success' ? 'default' : 'destructive'}>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                        {flash.type === 'success' ? 'Success' : 'Error'}
                    </AlertTitle>
                    <AlertDescription>{flash.message}</AlertDescription>
                </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {plugins.map((plugin) => (
                    <PluginCard key={plugin.id} plugin={plugin} onToggle={handleToggle} />
                ))}
            </div>

            <Button asChild className="mt-4">
                <Link href={route('plugins.scan')}>Scan for New Plugins</Link>
            </Button>
        </div>
    );
};

export default function PluginManagement({ plugins }) {
    return (
        <AppLayout current_page="plugins">
            <PluginList plugins={plugins} />
        </AppLayout>
    );
}
