import React from 'react';
import { FaSync } from 'react-icons/fa';
import './CustomerHeader.css';
const CustomerHeader = () => {
    return (
        <div className="customer-header">
            <h1 className="customer-title">DANH SÁCH KHÁCH HÀNG</h1>
            <div className="header-actions">
                <button className="reload-button">
                    <FaSync />
                </button>
                <select className="time-selector">
                    <option value="today">Hôm nay</option>
                    <option value="thisWeek">Tuần này</option>
                    <option value="thisMonth">Tháng này</option>
                    <option value="thisYear">Năm này</option>
                </select>
                <input type="date" className="specific-date-picker" />
            </div>
        </div>
    );
};

export default CustomerHeader;