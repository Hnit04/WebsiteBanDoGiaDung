// src/components/vouchers/CreateVoucherPage.jsx
import React, { useState } from 'react';
import './CreateVoucherInfo.css';

const CreateVoucherInfo = () => {
    const [voucherData, setVoucherData] = useState({
        name: '',
        barcode: '',
        description: '',
        type_voucher: '',
        value_voucher: '',
        discount_method: '',
        start_date: '',
        end_date: '',
        status_voucher: '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = () => {
        console.log('New Voucher Data:', voucherData);
        // Here, you can add functionality to save the new voucher
        // For example, make an API call to your backend
    };

    return (
        <div className="create-voucher-page">
            <div className="create-voucher-container">
                <h2>Thông tin</h2>
                <p>Điền các thông tin cho mã giảm giá mới.</p>
                <div className="create-voucher-form">
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
                        Tạo Khuyến Mãi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateVoucherInfo;
