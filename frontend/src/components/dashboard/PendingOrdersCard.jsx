import React from 'react';
import './OrderCard.css';

const PendingOrdersCard = ({ orders }) => {
    return (
        <div className="order-card">
            <h3>Danh sách đơn hàng cần xác nhận</h3>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt hàng</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.status}</td>
                            <td>{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PendingOrdersCard;