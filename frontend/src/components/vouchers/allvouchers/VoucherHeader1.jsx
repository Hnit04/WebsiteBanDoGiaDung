// src/components/products/ProductHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const VoucherHeader1 = ({ voucherCount }) => {
    const navigate = useNavigate();

    // Hàm chuyển hướng đến trang thêm sản phẩm
    const handleCreateVoucher = () => {
        navigate('/vouchers/createVoucher');
    };
    return (
        <div className="voucher-total">
            <p>Tất cả khuyến mãi ({voucherCount})</p>
            <div className="filter">
                <select className="sort">
                    <option>Sắp xếp theo</option>
                    <option value="price">Giá</option>
                    <option value="sold">Đã bán</option>
                    <option value="quantity">Số lượng</option>
                </select>
                <input className="search-voucher" type="text" placeholder="Tìm kiếm sản phẩm" />
                <button className="insert-voucher" onClick={handleCreateVoucher}>Tạo khuyến mãi</button>
            </div>
        </div>
    );
};

export default VoucherHeader1;
