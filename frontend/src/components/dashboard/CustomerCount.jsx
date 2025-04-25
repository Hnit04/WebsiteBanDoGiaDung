import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
const CustomerCount = ({ customerCount }) => {
    return (
        <div className="dashboard-card">
            <h3>{customerCount}</h3>
            <p>Số lượng khách hàng</p>
            <span className="comment">
                <FaMapMarkerAlt style={{ marginRight: '5px' }} /> 
                Tổng số khách hàng đã có tài khoản
            </span>
        </div>
    );
};

export default CustomerCount;