import React from 'react';
import { FaSync } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import "./EditVoucherHeader.css";
const EditVoucherHeader = () => {
    const navigate = useNavigate();
    //Hàm quay về trang tất cả sản phẩm
    const handleReturnVouchers = () => {
        navigate('/vouchers/allvouchers');
    };
    return (
        <div className="voucher-header">
            <h1 className="voucher-title">CHỈNH SỬA KHUYẾN MÃI</h1>
            <div className="header-actions">
                <button className="reload-button">
                    <FaSync />
                </button>
                <button className='return-voucher' onClick={handleReturnVouchers}>Quay lại</button>
            </div>
        </div>
    );
};
export default EditVoucherHeader;
