import React from 'react';
import { FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const CreateVoucherHeader = () => {
    const navigate = useNavigate();
    //Hàm quay về trang tất cả khuyến mãi
    const handleReturnVouchers = () => {
        navigate('/vouchers/allVouchers');
    };
    return (
        <div className="voucher-header">
            <h1 className="voucher-title">TẠO KHUYẾN MÃI</h1>
            <div className="header-actions">
                <button className="reload-button">
                    <FaSync />
                </button>
                <button className='return-voucher' onClick={handleReturnVouchers}>Quay lại</button>
            </div>
        </div>
    );
};

export default CreateVoucherHeader;