import { useLaravelReactI18n } from 'laravel-react-i18n';

export const useTranslations = () => {
    const { t, tChoice } = useLaravelReactI18n();

    const tPlural = (key, replacements) => {
        return tChoice(key, 2, replacements);
    };

    return {
        t,
        tChoice,
        tPlural
    };
};
