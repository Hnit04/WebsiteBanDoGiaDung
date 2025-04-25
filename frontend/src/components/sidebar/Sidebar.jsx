import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaBox, FaClipboardList, FaUsers, FaTag, FaCog } from 'react-icons/fa'; // Nhập các icon từ react-icons
import './Sidebar.css';
import { useState } from 'react';

const Sidebar = () => {
    const [isProductDropOn, setProductDrop] = useState(false);

    const [isVoucherDropOn, setVoucherDrop] = useState(false);
    const toggleProductDropdown = () => {
        setProductDrop(!isProductDropOn);
    }
    const toggleVoucherDropdown = () => {
        setVoucherDrop(!isVoucherDropOn);
    }


    return (
        <div className="sidebar">
            <ul>
                <li>
                    <Link to="/dashboard"><FaHome />Bảng điều khiển</Link>
                </li>
                <li onClick={toggleProductDropdown} className="sidebar-item">
                    <div>
                        <div className="sidebar-button">

                            <FaBox /> Sản phẩm
                        </div>
                        {isProductDropOn && (
                            <div>
                                <ul className={`sub-menu ${isProductDropOn ? 'show' : ''}`}>
                                    <li><Link to="/products/allProducts">Tất cả sản phẩm</Link></li>
                                    <li><Link to="/products/insertProduct">Thêm mới sản phẩm</Link></li>
                                    <li><Link to="/products/discountProducts">Giảm giá sản phẩm</Link></li>
                                </ul>
                            </div>
                        )}
                    </div>
                </li>
                <li onClick={toggleVoucherDropdown} className="sidebar-item">
                    <div>
                        <div className="sidebar-button">
                            <FaTag /> Khuyến mãi
                        </div>
                        {isVoucherDropOn && (
                            <div>
                                <ul className={`sub-menu ${isVoucherDropOn ? 'show' : ''}`}>
                                    <li><Link to="/vouchers/allVouchers">Tất cả khuyến mãi</Link></li>
                                    <li><Link to="/vouchers/createVoucher">Tạo mới khuyến mãi</Link></li>

                                </ul>
                            </div>
                        )}
                    </div>
                </li>
                <li><Link to="/orders"><FaClipboardList />Đơn hàng</Link></li>
                <li><Link to="/customers"><FaUsers />Khách hàng</Link></li>
                <li><Link to="/setting"><FaCog />Cài đặt</Link></li>
            </ul>
        </div>
    );
};

export default Sidebar;
