import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const RevenueToday = ({ revenue }) => {
    return (
        <div className="dashboard-card">
            <h3>{revenue} đ</h3>
            <p>Doanh thu trong ngày</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Doanh thu khi đơn hàng đã được thanh toán
            </span>
        </div>
    );
};

export default RevenueToday;
