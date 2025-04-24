import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const TotalOrders = ({ totalOrders }) => {
    return (
        <div className="dashboard-card">
            <h3>{totalOrders}</h3>
            <p>Tổng số đơn hàng</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Số đơn hàng đặt trong ngày
            </span>
        </div>
    );
};

export default TotalOrders;