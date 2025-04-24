// src/components/vouchers/EditVoucherTable.jsx
import React, { useState, useEffect } from 'react';
import './EditVoucherTable.css';

const EditVoucherTable = ({ voucherId }) => {
    const [voucherData, setVoucherData] = useState(null);

    useEffect(() => {
        const fetchVoucherData = async () => {
            const fetchedData = await mockFetchVoucherById(voucherId);
            setVoucherData(fetchedData);
        };
        fetchVoucherData();
    }, [voucherId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log('Updated Voucher Data:', voucherData);
    };

    if (!voucherData) return <p>Loading...</p>;

    return (
        <div className="voucher-container">
            <div className="edit-voucher-page"> 
                <div className="edit-voucher-container">
                    <h2>Tổng quan</h2>
                    <p>Các thông tin cơ bản của mã giảm giá</p>
                    <div className="edit-voucher-form">
                        <div className="form-group">
                            <label>Tiêu đề khuyến mãi</label>
                            <input
                                type="text"
                                name="name"
                                value={voucherData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mã khuyến mãi</label>
                            <input
                                type="text"
                                name="barcode"
                                value={voucherData.barcode}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Mô tả</label>
                            <input
                                type="text"
                                name="description"
                                value={voucherData.description}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Loại giảm giá</label>
                                <input
                                    type="text"
                                    name="type_voucher"
                                    value={voucherData.type_voucher}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Giá trị</label>
                                <input
                                    type="number"
                                    name="value_voucher"
                                    value={voucherData.value_voucher}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phương thức giảm giá</label>
                                <input
                                    type="text"
                                    name="discount_method"
                                    value={voucherData.discount_method}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Thời gian bắt đầu</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    value={voucherData.start_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Thời gian kết thúc</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    value={voucherData.end_date}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Trạng thái</label>
                                <input
                                    type="text"
                                    name="status_voucher"
                                    value={voucherData.status_voucher}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                        <button className="save-button" onClick={handleSave}>
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            </div>
            <div className="sumary-voucher">
                {/* Summary Table */}
                <div className="summary-table">
                    <table>
                        <thead>
                            <h3>Bảng Tóm Tắt</h3>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Tiêu đề khuyến mãi:</strong></td>
                                <td>{voucherData.name}</td>
                            </tr>
                            <tr>
                                <td><strong>Mã khuyến mãi:</strong></td>
                                <td>{voucherData.barcode}</td>
                            </tr>
                            <tr>
                                <td><strong>Mô tả:</strong></td>
                                <td>{voucherData.description}</td>
                            </tr>
                            <tr>
                                <td><strong>Loại giảm giá:</strong></td>
                                <td>{voucherData.type_voucher}</td>
                            </tr>
                            <tr>
                                <td><strong>Giá trị:</strong></td>
                                <td>{voucherData.value_voucher}</td>
                            </tr>
                            <tr>
                                <td><strong>Phương thức giảm giá:</strong></td>
                                <td>{voucherData.discount_method}</td>
                            </tr>
                            <tr>
                                <td><strong>Thời gian bắt đầu:</strong></td>
                                <td>{voucherData.start_date}</td>
                            </tr>
                            <tr>
                                <td><strong>Thời gian kết thúc:</strong></td>
                                <td>{voucherData.end_date}</td>
                            </tr>
                            <tr>
                                <td><strong>Trạng thái:</strong></td>
                                <td>{voucherData.status_voucher}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    );
};

// Mock data fetching function
const mockFetchVoucherById = async (id) => {
    const mockData = {
        id: id,
        name: 'Sample Voucher',
        barcode: 'ABC123',
        description: 'Mô tả khuyến mãi',
        type_voucher: 'Percentage',
        value_voucher: '20',
        discount_method: 'Direct',
        start_date: '2023-11-01',
        end_date: '2023-11-30',
        status_voucher: 'Active',
    };
    return new Promise((resolve) => setTimeout(() => resolve(mockData), 500));
};

export default EditVoucherTable;
