import './bootstrap';
import '../css/app.css';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { LaravelReactI18nProvider } from 'laravel-react-i18n';
import {useEffect, useState} from 'react';
import {PluginHook, setHooksLoaded} from './hooks';
import '@fontsource/inter';

const appName = import.meta.env.VITE_APP_NAME || 'Nexius';

function PluginLoader({ children, loadedPlugins }) {
    const [hooksAreLoaded, setHooksAreLoaded] = useState(false);

    useEffect(() => {
        async function loadPluginHooks() {
            for (const plugin of loadedPlugins || []) {
                try {
                    const module = await import(`../../plugins/${plugin.directory}/resources/js/index.js`);
                    if (typeof module.default === 'function') {
                        module.default(plugin.name);
                    }
                } catch (error) {
                    console.error(`Failed to load hooks for plugin: ${plugin.name}`, error);
                }
            }
            setHooksLoaded();
            setHooksAreLoaded(true);
        }
        loadPluginHooks();
    }, [loadedPlugins]);

    // if (!hooksAreLoaded) {
    //     return <div>Loading plugins...</div>; // Ou un autre indicateur de chargement
    // }

    return <>{children}</>;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const parts = name.split('::');
        if (parts.length > 1) {
            return resolvePageComponent(`../../plugins/${parts[0]}/resources/js/Pages/${parts[1]}.jsx`, import.meta.glob('../../plugins/*/resources/js/Pages/**/*.jsx'));
        }
        if(name.startsWith('Templates')){
            return resolvePageComponent(`./${name}.jsx`, import.meta.glob('./Templates/**/*.jsx'))
        }
        return resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'))
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <LaravelReactI18nProvider
                locale={props.initialPage.props.locale || 'en'}
                fallbackLocale={'en'}
                files={import.meta.glob('/lang/*.json')}
            >
                <PluginLoader loadedPlugins={props.initialPage.props.loadedPlugins}>
                    <App {...props} />
                </PluginLoader>
            </LaravelReactI18nProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// Exportez PluginHook pour l'utiliser dans d'autres composants
export { PluginHook };
