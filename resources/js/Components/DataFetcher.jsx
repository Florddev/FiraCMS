import React, { useState, useEffect, useCallback } from 'react';
import { usePage, router } from '@inertiajs/react';
import { useDebounce } from '@/Hooks/useDebounce';
import AppPagination from "@/Components/App/AppPagination.jsx";

const DataFetcher = ({ src, properties, pagination = null, max = null, children }) => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isPaginated, setIsPaginated] = useState(false);
    const { errors, data: responseData } = usePage().props;

    const debouncedProperties = useDebounce(properties, 300);

    const fetchData = useCallback(() => {
        const params = { ...debouncedProperties };
        if (pagination !== null) {
            params.page = currentPage;
            params.per_page = pagination;
        }
        if (max !== null) {
            params.max = max;
        }
        router.get(src, params, {
            preserveState: true,
            preserveScroll: true,
            only: ['data'],
        });
    }, [src, debouncedProperties, currentPage, pagination, max]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (responseData) {
            setData(responseData.data);
            const paginated = responseData.hasOwnProperty('current_page') && responseData.hasOwnProperty('last_page');
            setIsPaginated(paginated);
            if (paginated) {
                setCurrentPage(responseData.current_page);
                setTotalPages(responseData.last_page);
            } else {
                setCurrentPage(1);
                setTotalPages(1);
            }
        }
    }, [responseData]);

    const handlePageChange = (page) => {
        if (pagination !== null) {
            setCurrentPage(page);
        }
    };

    return children({
        data,
        currentPage,
        totalPages,
        onPageChange: handlePageChange,
        errors,
        isPaginated,
    });
};

DataFetcher.Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <AppPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
    );
};

DataFetcher.Errors = ({ errors }) => {
    if (!errors || Object.keys(errors).length === 0) return null;
    return (
        <div className="error-messages">
            {Object.values(errors).map((error, index) => (
                <p key={index} className="text-red-500">{error}</p>
            ))}
        </div>
    );
};

export default DataFetcher;
