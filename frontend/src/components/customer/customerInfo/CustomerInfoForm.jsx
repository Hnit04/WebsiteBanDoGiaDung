import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CustomerInfo.css';

const CustomerInfoForm = () => {
    const location = useLocation();
    const { customer } = location.state || {};

    const [customerData] = useState({
        name: customer.name || '',
        gender: customer.gender || '',
        phone_number: customer.phone_number || '',
        address: customer.address || '',
        email: customer.email || '',
        avatarUrl: customer.avatarUrl || 'default-avatar.png'
    });

    const [selectedInvoice, setSelectedInvoice] = useState(null); // Track the selected invoice
    const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open

    const purchaseHistory = [
        {
            date: '2024-01-01',
            totalAmount: 200000,
            productQuantity: 3,
            invoiceId: 'INV123',
            products: [
                { name: 'Sản phẩm A', price: 50000, quantity: 1, total: 50000 },
                { name: 'Sản phẩm B', price: 50000, quantity: 2, total: 100000 },
            ]
        },
        {
            date: '2024-02-15',
            totalAmount: 150000,
            productQuantity: 2,
            invoiceId: 'INV124',
            products: [
                { name: 'Sản phẩm C', price: 75000, quantity: 2, total: 150000 },
            ]
        },
    ];

    const handleViewInvoice = (invoiceId) => {
        setSelectedInvoice(invoiceId); // Set the selected invoice
        setIsModalOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
        setSelectedInvoice(null); // Reset the selected invoice
    };

    return (
        <div className="customer-info-container">
            <div className="customer-info-header">
                <div className="customer-details">
                    <div className="info-item">
                        <label>Tên Khách Hàng:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={customerData.name} 
                            readOnly
                        />
                    </div>
                        <div className="info-item">
                            <label>Giới Tính:</label>
                            <input 
                                type="text" 
                                name="gender" 
                                value={customerData.gender} 
                                readOnly
                            />
                        </div>
                        <div className="info-item">
                            <label>Số Điện Thoại:</label>
                            <input 
                                type="text" 
                                name="phone_number" 
                                value={customerData.phone_number} 
                                readOnly
                            />
                        </div>
                    <div className="info-item">
                        <label>Địa Chỉ:</label>
                        <input 
                            type="text" 
                            name="address" 
                            value={customerData.address} 
                            readOnly
                        />
                    </div>
                    <div className="info-item">
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={customerData.email} 
                            readOnly
                        />
                    </div>
                </div>
                <div className="customer-avatar">
                    <img src={customerData.avatarUrl} alt="Avatar" />
                </div>
            </div>

            <div className="purchase-history">
                <h3>Lịch Sử Mua Hàng</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Ngày Mua Hàng</th>
                            <th>Tổng Tiền Mua</th>
                            <th>Số Lượng Sản Phẩm</th>
                            <th>Chi Tiết Hóa Đơn</th>
                        </tr>
                    </thead>
                    <tbody>
                        {purchaseHistory.map((purchase, index) => (
                            <tr key={index}>
                                <td>{purchase.date}</td>
                                <td>{purchase.totalAmount} VND</td>
                                <td>{purchase.productQuantity}</td>
                                <td>
                                    <button onClick={() => handleViewInvoice(purchase.invoiceId)}>
                                        Xem Chi Tiết
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal to display invoice details in table format */}
            {isModalOpen && selectedInvoice && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h4>Chi Tiết Hóa Đơn</h4>
                        <table className="invoice-table">
                            <thead>
                                <tr>
                                    <th>Tên Sản Phẩm</th>
                                    <th>Giá</th>
                                    <th>Số Lượng</th>
                                    <th>Tổng Giá</th>
                                </tr>
                            </thead>
                            <tbody>
                                {purchaseHistory
                                    .filter(purchase => purchase.invoiceId === selectedInvoice)
                                    .map((purchase) => (
                                        purchase.products.map((product, index) => (
                                            <tr key={index}>
                                                <td>{product.name}</td>
                                                <td>{product.price} VND</td>
                                                <td>{product.quantity}</td>
                                                <td>{product.total} VND</td>
                                            </tr>
                                        ))
                                    ))}
                            </tbody>
                        </table>
                        <div className="modal-buttons">
                            <button type="button" onClick={handleCloseModal}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerInfoForm;
