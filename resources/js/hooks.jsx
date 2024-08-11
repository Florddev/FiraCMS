import React, { useState, useEffect } from 'react';

const hooks = {};
let hooksLoaded = false;

export function registerHook(name, component, pluginName) {
    if (!hooks[name]) {
        hooks[name] = [];
    }
    hooks[name].push({ component, pluginName });
}

export function setHooksLoaded() {
    hooksLoaded = true;
}

export function PluginHook({ name }) {
    const [, forceUpdate] = useState({});

    useEffect(() => {
        if (!hooksLoaded) {
            const checkHooksLoaded = setInterval(() => {
                if (hooksLoaded) {
                    clearInterval(checkHooksLoaded);
                    forceUpdate({});
                }
            }, 100);
            return () => clearInterval(checkHooksLoaded);
        }
    }, []);

    if (!hooks[name] || hooks[name].length === 0) {
        return null;
    }

    return (
        <>
            {hooks[name].map(({ component: Component, pluginName }, index) => (
                <React.Fragment key={`${name}-${pluginName}-${index}`}>
                    <Component />
                </React.Fragment>
            ))}
        </>
    );
}
