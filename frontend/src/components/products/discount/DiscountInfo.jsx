import React, {useState} from 'react';
import './DiscountProducts.css'
const DiscountInfo = () => {
    const [nameDiscount, setNameDiscount] = useState('');
    const [typeDiscount, setTypeDiscount] = useState('');
    const [sale, setSale] = useState('');
    const [timeStartDiscount, setTimeStartDiscount] = useState('');
    const [timeEndDiscount, setTimeEndDiscount] = useState('');
    return (
        <div>         
            <div className="discount-info-page">
        `       <div className="discount-form-page">
                    <div className="form-container">
                        <h2>Cơ bản</h2>
                        <div className="form-group">
                            <label>Tên khuyến mãi</label>
                            <input
                                type="text"
                                value={nameDiscount}
                                onChange={(e) => setNameDiscount(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Loại sản phẩm</label>
                                <div className="fillter">
                                    <select className="option-typediscount" value={typeDiscount} onChange={(e) => setTypeDiscount(e.target.value)} required>
                                        <option>Loại 1</option>
                                        <option>Loại 2</option>
                                        <option>Loại 3</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Giảm</label>
                                <input
                                    type="text"
                                    value={sale}
                                    onChange={(e) => setSale(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Thời gian bắt đầu</label>
                                <input
                                className="specific-date-picker"
                                type="date"
                                value={timeStartDiscount}
                                onChange={(e) => setTimeStartDiscount(e.target.value)}
                                required
                                />
                            </div>               
                            <div className="form-group">
                                <label>Thời gian kết thúc</label>
                                <input
                                className="specific-date-picker"
                                type="date"
                                value={timeEndDiscount}
                                onChange={(e) => setTimeEndDiscount(e.target.value)}
                                required
                                />
                            </div>               

                        </div>

                    </div>
                    
                </div>`
            </div>
            <div className="discount-for-products">
                <div className="form-container">
                    <h2>Áp dụng</h2>
                    <p style={{fontSize: '14px', color: 'rgb(92, 92, 92)'}}>Chọn những sản phẩm áp dụng giảm giá này</p>
                </div>

            </div>  
        </div>

    );
};

export default DiscountInfo;