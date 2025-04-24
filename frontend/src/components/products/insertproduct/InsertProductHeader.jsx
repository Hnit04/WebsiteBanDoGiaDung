import React from 'react';
import { FaSync } from 'react-icons/fa';
import './InsertProduct.css'; 
import { useNavigate } from 'react-router-dom';

const InsertProductHeader = () => {
    const navigate = useNavigate();
    //Hàm quay về trang tất cả sản phẩm
    const handleReturnProducts = () => {
        navigate('/products/allProducts');
    };
    return (
        <div className="product-header">
            <h1 className="product-title">THÊM SẢN PHẨM</h1>
            <div className="header-actions">
                <button className="reload-button">
                    <FaSync />
                </button>
                <button className='return-product' onClick={handleReturnProducts}>Quay lại</button>
            </div>
        </div>
    );
};
export default InsertProductHeader;
