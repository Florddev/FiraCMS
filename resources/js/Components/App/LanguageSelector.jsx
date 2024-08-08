// import React from 'react';
// import { useTranslation } from 'react-i18next';
// import { router } from '@inertiajs/react';
// import { Check, ChevronDown } from "lucide-react";
// import { Button } from "@/Components/ui/button";
// import {
//     DropdownMenu,
//     DropdownMenuCheckboxItem,
//     DropdownMenuContent,
//     DropdownMenuTrigger,
// } from "@/Components/ui/dropdown-menu";
// import useTranslationLoader from "@/Hooks/useTranslationLoader";
//
// const LanguageSelector = ({ currentLocale, availableLocales }) => {
//     const { t, i18n } = useTranslation();
//     const isLoaded = useTranslationLoader();
//
//     console.log(currentLocale, availableLocales);
//
//     const changeLanguage = (locale) => {
//         i18n.changeLanguage(locale);
//         router.post(route('change.locale'), { locale });
//     };
//
//     if (!isLoaded || !availableLocales || Object.keys(availableLocales).length === 0) {
//         return null;
//     }
//
//     return (
//         <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//                 <Button variant="outline" className="w-[200px] justify-between">
//                     {availableLocales[currentLocale]}
//                     <ChevronDown className="ml-2 h-4 w-4" />
//                 </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent className="w-[200px]">
//                 {Object.entries(availableLocales).map(([key, value]) => (
//                     <DropdownMenuCheckboxItem
//                         key={key}
//                         checked={currentLocale === key}
//                         onCheckedChange={() => changeLanguage(key)}
//                     >
//                         <span>{value}</span>
//                         {currentLocale === key && (
//                             <Check className="ml-auto h-4 w-4" />
//                         )}
//                     </DropdownMenuCheckboxItem>
//                 ))}
//             </DropdownMenuContent>
//         </DropdownMenu>
//     );
// };
//
// export default LanguageSelector;
