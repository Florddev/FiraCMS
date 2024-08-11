import React from 'react';
import { Link } from '@inertiajs/react';

export default function PluginIndex({ plugins }) {
    return (
        <div>
            <h1>Plugins</h1>
            <table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {plugins.map((plugin) => (
                    <tr key={plugin.id}>
                        <td>{plugin.name}</td>
                        <td>{plugin.enabled ? 'Enabled' : 'Disabled'}</td>
                        <td>
                            <Link
                                href={route('plugins.toggle', plugin.id)}
                                method="post"
                                as="button"
                                className="btn btn-primary"
                            >
                                {plugin.enabled ? 'Disable' : 'Enable'}
                            </Link>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
