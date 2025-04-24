import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const SuccessfulOrders = ({ successfulOrders }) => {
    return (
        <div className="dashboard-card">
            <h3>{successfulOrders}</h3>
            <p>Số đơn hàng thành công</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Tổng số đơn hàng đã được giao đến khách hàng
            </span>
        </div>
    );
};

export default SuccessfulOrders;