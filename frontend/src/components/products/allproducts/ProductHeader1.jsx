// src/components/products/ProductHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProductHeader1 = ({ productCount }) => {
    const navigate = useNavigate();

    // Hàm chuyển hướng đến trang thêm sản phẩm
    const handleInsertProduct = () => {
        navigate('/products/insertProduct');
    };
    return (
        <div className="product-total">
            <p>Tất cả sản phẩm ({productCount})</p>
            <div className="filter">
                <select className="sort">
                    <option>Sắp xếp theo</option>
                    <option value="price">Giá</option>
                    <option value="sold">Đã bán</option>
                    <option value="quantity">Số lượng</option>
                </select>
                <select className="choose-directory">
                    <option>Chọn danh mục</option>
                    <option value="category1">Men</option>
                    <option value="category2">Women</option>
                    <option value="category2">Kids</option>
                </select>
                <input className="search-product" type="text" placeholder="Tìm kiếm sản phẩm" />
                <button className="insert-product" onClick={handleInsertProduct}>Thêm sản phẩm</button>
            </div>
        </div>
    );
};

export default ProductHeader1;
