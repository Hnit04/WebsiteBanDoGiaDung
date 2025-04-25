import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './InsertProduct.css';
import RightSidebar from './RightSidebar'; // Adjust the import as needed

const InsertProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [basePrice, setBasePrice] = useState(''); // For the original price
    const [sizes, setSizes] = useState({ S: false, M: false, L: false, XL: false, XXL: false });
    const [quantity, setQuantity] = useState('');
    const [details, setDetails] = useState('');

    const handleSizeChange = (size) => {
        setSizes((prevSizes) => ({
            ...prevSizes,
            [size]: !prevSizes[size],
        }));
    };

    return (
        <div className="insert-product-page d-flex flex-row">
            <div className="form-container">
                <div className="form-group">
                    <label>Tên sản phẩm:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên sản phẩm"
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Giá bán:</label>
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Nhập giá bán"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Giá gốc:</label>
                        <input
                            type="number"
                            value={basePrice}
                            onChange={(e) => setBasePrice(e.target.value)}
                            placeholder="Nhập giá gốc"
                            required
                        />
                    </div>
                </div>

                <div className="form-group d-flex flex-row">
                    <label>Chọn kích thước:</label>
                    <div className="size-options">
                        {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                            <label key={size} className="size-checkbox">
                                <input
                                    type="checkbox"
                                    checked={sizes[size]}
                                    onChange={() => handleSizeChange(size)}
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Số lượng:</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="Nhập số lượng"
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Mô tả:</label>
                    <ReactQuill
                        value={details}
                        onChange={setDetails}
                        className="details-editor"
                    />
                </div>
                <button type="submit" className="submit-button">Thêm sản phẩm</button>
            </div>
            <RightSidebar />
        </div>
    );
};

export default InsertProduct;
