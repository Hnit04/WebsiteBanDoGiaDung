import React from 'react';
import './OrderCard.css';

const PendingPaymentOrdersCard = ({ orders }) => {
    return (
        <div className="order-card">
            <h3>Danh sách đơn hàng cần thanh toán</h3>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th>Trạng thái thanh toán</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.paymentStatus}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default PendingPaymentOrdersCard;