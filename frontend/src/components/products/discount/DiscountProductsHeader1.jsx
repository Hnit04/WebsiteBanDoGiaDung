// src/components/products/ProductHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DiscountProducts.css'; 

const DiscountProductsHeader1 = ({ productCount }) => {
    const navigate = useNavigate();

    // Hàm chuyển hướng đến trang thêm sản phẩm giảm giá
    const handleInsertDiscountProduct = () => {
        navigate('/products/discountProducts/discountInfo');
    };
    return (
        <div className="discount-total">
            <p>Tất cả sản phẩm ({productCount})</p>
            <div className="filter">
                <select className="sort">
                    <option>Sắp xếp theo</option>
                    <option value="price">Giá</option>
                    <option value="sold">Đã bán</option>
                    <option value="quantity">Số lượng</option>
                </select>
                
                <input className="search-discount" type="text" placeholder="Tìm kiếm sản phẩm" />
                <button className="insert-discount" onClick={handleInsertDiscountProduct}>Thêm mới</button>
            </div>
        </div>
    );
};

export default DiscountProductsHeader1;
