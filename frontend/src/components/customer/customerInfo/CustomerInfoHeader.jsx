import React from 'react';
import { FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "../allcustomers/CustomerHeader.css";

const CustomerInfoHeader = () => {
    const navigate = useNavigate();
    const handleReturnCustomers = () => {
        navigate('/customers');
    };
    return (
        <div className="customer-header">
            <h1 className="customer-title">THÔNG TIN CÁ NHÂN KHÁCH HÀNG</h1>
            <div className="header-actions">
                <button className="reload-button">
                    <FaSync />
                </button>
                <button className='return-customer' onClick={handleReturnCustomers}>Quay lại</button>
            </div>
        </div>
    );
};

export default CustomerInfoHeader;