import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import axios from 'axios';

const loadTranslations = async (lang) => {
    try {
        const response = await axios.get(`/api/translations/${lang}`);
        return response.data;
    } catch (error) {
        console.error('Erreur lors du chargement des traductions:', error);
        return {};
    }
};

i18n
    .use(initReactI18next)
    .init({
        lng: document.documentElement.lang || 'en',
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/api/translations/{{lng}}',
            parse: (data) => data,
            ajax: loadTranslations,
        },
    });

export default i18n;
