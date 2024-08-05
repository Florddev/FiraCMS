import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

function useTranslationLoader() {
    const { i18n } = useTranslation();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const loadTranslations = async () => {
            try {
                setIsLoaded(false);
                const response = await axios.get(`/api/translations/${i18n.language}`);
                await i18n.addResourceBundle(i18n.language, 'translation', response.data, true, true);
                await i18n.changeLanguage(i18n.language);
            } catch (error) {
                console.error('Failed to load translations:', error);
            } finally {
                setIsLoaded(true);
            }
        };

        loadTranslations();
    }, [i18n.language]);

    return isLoaded;
}

export default useTranslationLoader;
