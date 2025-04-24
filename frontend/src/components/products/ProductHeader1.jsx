// src/components/products/ProductHeader.jsx
import React from 'react';

const ProductHeader1 = ({ productCount }) => {
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
                    <option value="category1">Danh mục 1</option>
                    <option value="category2">Danh mục 2</option>
                </select>
                <input className="search-product" type="text" placeholder="Tìm kiếm sản phẩm" />
                <button className="insert-product">Thêm sản phẩm</button>
            </div>
        </div>
    );
};

export default ProductHeader1;
