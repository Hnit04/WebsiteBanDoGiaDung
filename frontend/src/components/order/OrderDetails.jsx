import React, {useState} from 'react';
import './OrderDetails.css';

const OrderDetails = ({ order, onClose }) => {
    const [status, setStatus] = useState(order.status || "Pending Confirmation");

    const handleStatusChange = (e) => {
        setStatus(e.target.value);
    };
    if (!order) return null; // Return null if no order is selected

    return (
        <div className="order-modal-overlay">
            <div className="order-modal-content">
                <button className="close-button" onClick={onClose}>X</button>
                <h2>Chi Tiết Đơn Hàng</h2>
                <p><strong>Mã Đơn Hàng:</strong> {order.barcode}</p>
                <p><strong>Thời Gian Đặt Hàng:</strong> {order.start_order_time}</p>
                <p><strong>Giảm Giá:</strong> {order.isDiscount}</p>
                <p><strong>Tổng Đơn Hàng:</strong> {order.total_orders}</p>
                <div className="status-row">
                    <label htmlFor="status">Trạng thái:</label>
                    <select id="status" value={status} onChange={handleStatusChange}>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="confirmed">Xác nhận</option>
                    </select>
                </div>
                <p><strong>Thanh Toán:</strong> {order.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}</p>
                
                <h3>Danh Sách Sản Phẩm</h3>
                <table className="order-products-table">
                    <thead>
                        <tr>
                            <th>Tên Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Giá</th>
                            <th>Tổng Giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.products.map((product, index) => (
                            <tr key={index}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>{product.price}</td>
                                <td>{product.total}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderDetails;
