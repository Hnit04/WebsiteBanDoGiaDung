// src/components/vouchers/VoucherTable.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './VoucherTable.css';
import { useNavigate } from 'react-router-dom';


const VoucherTable = ({ vouchers }) => {
    const [selectedVouchers, setSelectedVouchers] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const navigate = useNavigate();
    // Xử lý khi checkbox chọn tất cả được bật hoặc tắt
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allVoucherIds = vouchers.map((voucher) => voucher.id);
            setSelectedVouchers(allVoucherIds);
        } else {
            setSelectedVouchers([]);
        }
    };

    // Xử lý khi checkbox cho từng khuyến mãi được bật hoặc tắt
    const handleSelectVoucher = (id) => {
        setSelectedVouchers((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((voucherId) => voucherId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    const handleSelectDelete = () => {
        // Xử lý xóa khuyến mãi (giả lập ở đây)
        console.log('Khuyến mãi sẽ bị xóa:', selectedVouchers);
        setShowConfirmDelete(false);
        // Sau khi xóa xong, reset selectedvouchers
        setSelectedVouchers([]);
    };

    const handleConfirmDelete = () => {
        setShowConfirmDelete(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
    };

    const handleEditVoucher = (id) => {
        navigate(`editvoucher/${id}`);
    }
    return (
        <div>
            <div>
                <button className={`button-delete ${selectedVouchers.length > 0 ? 'enabled' : ''}`}
                    onClick={handleConfirmDelete}
                    disabled={selectedVouchers.length === 0}
                >
                    Xóa {selectedVouchers.length} khuyến mãi
                </button>
            </div>
            {showConfirmDelete && (
                <div className="confirm-delete-modal">
                    <p>Bạn có chắc chắn muốn xóa các khuyến mãi đã chọn?</p>
                    <div className="button-group">
                        <button onClick={handleSelectDelete}>Có</button>
                        <button onClick={handleCancelDelete}>Không</button>
                    </div>
                </div>
            )}
            <table className="voucher-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedVouchers.length === vouchers.length}
                            />
                        </th>
                        <th>TÊN KHUYẾN MÃI</th>
                        <th>MÃ KHUYẾN MÃI </th>
                        <th>LOẠI KHUYẾN MÃI</th>
                        <th>GIÁ TRỊ</th>
                        <th>TRẠNG THÁI</th>
                        <th>ĐÃ SỬ DỤNG</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {vouchers.map((voucher) => (
                        <tr key={voucher.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedVouchers.includes(voucher.id)}
                                    onChange={() => handleSelectVoucher(voucher.id)}
                                />
                            </td>
                            <td>{voucher.name}</td>
                            <td>{voucher.barcode}</td>
                            <td>{voucher.type_voucher}</td>
                            <td>{voucher.value_voucher}</td>
                            <td>{voucher.status_voucher}</td>
                            <td>{voucher.used_vouchers}</td>
                            <td>
                                <FaEdit className="icon" onClick={() => handleEditVoucher(voucher.id)} />
                                |
                                <FaTrash className="icon" onClick={() => handleDelete(voucher.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Hàm xử lý khi click vào icon xóa
const handleDelete = (id) => {
    console.log('Xóa khuyến mãi với ID:', id);
};

export default VoucherTable;
