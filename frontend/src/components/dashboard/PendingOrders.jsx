import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const PendingOrders = ({ pendingOrders }) => {
    return (
        <div className="dashboard-card">
            <h3>{pendingOrders}</h3>
            <p>Số đơn hàng cần duyệt</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Doanh thu khi đơn hàng được thanh toán
            </span>
        </div>
    );
};

export default PendingOrders;