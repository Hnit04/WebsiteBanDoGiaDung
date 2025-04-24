import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const OrderRevenue = ({ orderRevenue }) => {
    return (
        <div className="dashboard-card">
            <h3>{orderRevenue} đ</h3>
            <p>Doanh thu đơn hàng</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Tổng doanh thu đơn hàng trong ngày
            </span>
        </div>
    );
};

export default OrderRevenue;