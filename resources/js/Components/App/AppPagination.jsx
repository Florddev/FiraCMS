import React from 'react';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationPrevious,
    PaginationLink,
    PaginationEllipsis,
    PaginationNext
} from "@/Components/ui/pagination";

const AppPagination = ({ currentPage, totalPages, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    const renderPaginationItems = () => {
        const items = []

        // Toujours afficher la première page
        items.push(
            <PaginationItem key="first">
                <PaginationLink onClick={() => handlePageChange(1)} isActive={currentPage === 1} className="cursor-pointer">
                    1
                </PaginationLink>
            </PaginationItem>
        )

        // Ajouter des ellipses si nécessaire
        if (currentPage > 3) {
            items.push(<PaginationEllipsis key="ellipsis-start" />)
        }

        // Ajouter les pages autour de la page courante
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink onClick={() => handlePageChange(i)} isActive={currentPage === i} className="cursor-pointer">
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Ajouter des ellipses si nécessaire
        if (currentPage < totalPages - 2) {
            items.push(<PaginationEllipsis key="ellipsis-end" />)
        }

        // Toujours afficher la dernière page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key="last">
                    <PaginationLink onClick={() => handlePageChange(totalPages)} isActive={currentPage === totalPages} className="cursor-pointer">
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                    />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                    <PaginationNext
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
};

export default AppPagination;
