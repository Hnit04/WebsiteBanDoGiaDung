import React, { useState } from 'react';
import { ImProfile } from 'react-icons/im';
import './OrdersTable.css';
import OrderDetails from './OrderDetails';

const OrdersTable = ({ orders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    const handleIconClick = (order) => {
        setSelectedOrder(order); // Open modal with selected order details
    };

    const handleCloseModal = () => {
        setSelectedOrder(null); // Close modal
    };

    return (
        <div>
            <table className="order-table">
                <thead>
                    <tr>
                        <th>MÃ ĐƠN HÀNG</th>
                        <th>TRẠNG THÁI</th>
                        <th>GIẢM GIÁ</th>
                        <th>THỜI GIAN ĐẶT HÀNG</th>
                        <th>TỔNG ĐƠN HÀNG</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.barcode}</td>
                            <td>{order.status}</td>
                            <td>{order.isDiscount}</td>
                            <td>{order.start_order_time}</td>
                            <td>{order.total_orders}</td>
                            <td>
                                <ImProfile onClick={() => handleIconClick(order)} style={{ cursor: 'pointer' }} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedOrder && (
                <OrderDetails order={selectedOrder} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default OrdersTable;
