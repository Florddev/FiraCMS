import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import i18n from 'laravel-react-i18n/vite';
import fs from 'fs';
import path from 'path';

const pluginsPath = path.resolve(__dirname, 'plugins');

function getEnabledPlugins() {
    const plugins = [];
    if (fs.existsSync(pluginsPath)) {
        fs.readdirSync(pluginsPath).forEach(plugin => {
            const pluginJsPath = path.resolve(pluginsPath, plugin, 'resources/js/PluginComponent.jsx');
            if (fs.existsSync(pluginJsPath)) {
                plugins.push(plugin);
            }
        });
    }
    return plugins;
}

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/js/app.jsx',
                ...getEnabledPlugins().map(plugin =>
                    `plugins/${plugin}/resources/js/PluginComponent.jsx`
                )
            ],
            ssr: 'resources/js/ssr.jsx',
            refresh: true,
        }),
        react(),
        i18n(),
    ],
    resolve: {
        alias: {
            '@': '/resources/js',
            'Plugins': '/plugins'
        }
    }
});
