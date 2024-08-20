import React, {useState} from 'react';
import { useTranslation } from 'react-i18next';
import {router, usePage} from '@inertiajs/react';
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/Components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {useLaravelReactI18n} from "laravel-react-i18n";

const LanguageSelector = () => {
    const { availableLocales} = usePage().props;
    const { t, tChoice, setLocale, currentLocale } = useLaravelReactI18n();

    const changeLanguage = (key) => {
        setLocale(key);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between" size="sm">
                    <div className="flex items-center gap-2">
                        <span className="font-mono font-bold uppercase text-xs">{currentLocale()}</span>
                        {availableLocales[currentLocale()]}
                    </div>
                    <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
                {Object.entries(availableLocales).map(([key, value]) => (
                    <DropdownMenuCheckboxItem
                        key={key}
                        checked={currentLocale() === key}
                        onCheckedChange={() => changeLanguage(key)}
                        // onCheckedChange={() => changeLanguage(key)}
                        className="flex items-center gap-2"
                    >
                        <span className="font-mono font-bold uppercase text-xs">{key}</span>
                        <span>{value}</span>
                        {/*{locale === key && (*/}
                        {/*    <Check className="ml-auto h-4 w-4" />*/}
                        {/*)}*/}
                    </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default LanguageSelector;
