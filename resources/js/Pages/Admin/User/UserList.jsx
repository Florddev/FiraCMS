import React, {useEffect, useState} from 'react';
import DataFetcher from '@/Components/DataFetcher';
import AppPagination from "@/Components/App/AppPagination";
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import useTranslationLoader from "@/Hooks/useTranslationLoader";
import LanguageSelector from "@/Components/App/LanguageSelector.jsx";
import {usePage} from "@inertiajs/react";

const UserList = ({ defaultPerPage }) => {
    const { locale, availableLocales } = usePage().props;
    const { t } = useTranslation();
    const isLoaded = useTranslationLoader();

    const [properties, setProperties] = useState({
        search: '',
        orderBy: 'name',
        direction: 'asc',
    });

    const handlePropertyChange = (key, value) => {
        setProperties(prev => ({ ...prev, [key]: value }));
    };

    const handleSort = (column) => {
        setProperties(prev => ({
            ...prev,
            orderBy: column,
            direction: prev.orderBy === column && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">User List</h1>

            <h1>{t('messages.welcome')}</h1>
            <LanguageSelector
                currentLocale={locale}
                availableLocales={availableLocales}
            />

            <div className="mb-4">
                <input
                    type="text"
                    value={properties.search}
                    onChange={(e) => handlePropertyChange('search', e.target.value)}
                    placeholder="Search users"
                    className="border p-2 mr-2"
                />
            </div>

            <DataFetcher
                src={route("users.list")}
                properties={properties}
                pagination={defaultPerPage}  // Définir le nombre d'éléments par page
                max={50}       // Ou définir une limite de données
            >
                {({ data, currentPage, totalPages, onPageChange, errors, isPaginated }) => (
                    <>
                        <table className="w-full border-collapse border">
                            <thead>
                            <tr>
                                <th className="border p-2 cursor-pointer" onClick={() => handleSort('name')}>
                                    Name {properties.orderBy === 'name' && (properties.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="border p-2 cursor-pointer" onClick={() => handleSort('email')}>
                                    Email {properties.orderBy === 'email' && (properties.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th className="border p-2">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.map(user => (
                                <tr key={user.id}>
                                    <td className="border p-2">{user.name}</td>
                                    <td className="border p-2">{user.email}</td>
                                    <td className="border p-2">
                                        Edit
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {isPaginated && (
                            <DataFetcher.Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        )}
                        <DataFetcher.Errors errors={errors} />
                    </>
                )}
            </DataFetcher>
        </div>
    );
};

export default UserList;
