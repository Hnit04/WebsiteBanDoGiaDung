import React from 'react';

const CustomerHeader1 = ({customerCount}) => {

    return (
        <div className="customer-total">
            <p>Tất cả khách hàng({customerCount})</p>
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
                <input className="search-customer" type="text" placeholder="Tìm kiếm sản phẩm" />
            </div>
        </div>
    );
};

export default CustomerHeader1;