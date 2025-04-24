// src/components/PaginationOrders/PaginationOrders.jsx
import React, { useState } from 'react';
import './PaginationOrders.css';
const PaginationOrders = ({ totalItems, itemsPerPage, onPageChange, onItemsPerPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            onPageChange(page);
        }
    };

    const handleItemsPerPageChange = (event) => {
        onItemsPerPageChange(parseInt(event.target.value));
        setCurrentPage(1); // Reset to first page when items per page change
    };

    const renderPageButtons = () => {
        const pageButtons = [];
        for (let i = 1; i <= totalPages; i++) {
            if (i >= currentPage - 1 && i <= currentPage + 1) {
                pageButtons.push(
                    <button 
                        key={i} 
                        onClick={() => handlePageChange(i)} 
                        className={`page-button ${i === currentPage ? 'active' : ''}`}
                    >
                        {i}
                    </button>
                );
            }
        }
        return pageButtons;
    };
    return (
        <div className="pagination-order-container">
            <div className="pagination-order-left">
                <button className="nav-button" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    « Trước
                </button>
                {renderPageButtons()}
                <button className="nav-button" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    Tiếp theo »
                </button>
            </div>
            <div className="pagination-order-right">
                <span className="page-info">
                    Trang {currentPage} của {totalPages} - Hiển thị
                </span>
                <select className="items-per-page" onChange={handleItemsPerPageChange} defaultValue={itemsPerPage}>

                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={20}>20</option>
                </select>
                <span className="total-info">
                    / {totalItems}
                </span>
            </div>
        </div>
    );
};

export default PaginationOrders;
