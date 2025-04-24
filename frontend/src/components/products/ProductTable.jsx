// src/components/products/ProductTable.jsx
import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
const ProductTable = ({ products }) => {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: '1px solid #000000' }}>
            <thead>
                <tr>
                    <th style={styles.headerCell}>Tên sản phẩm</th>
                    <th style={styles.headerCell}>Số lượng</th>
                    <th style={styles.headerCell}>Giá</th>
                    <th style={styles.headerCell}>Đã bán</th>
                    <th style={styles.headerCell}>Loại sản phẩm</th>
                    <th style={styles.headerCell}></th>
                </tr>
            </thead>
            <tbody>
                {products.map((product, index) => (
                    <tr key={index} style={styles.row}>
                        <td style={styles.cell}>{product.name}</td>
                        <td style={styles.cell}>{product.quantity}</td>
                        <td style={styles.cell}>{product.price}</td>
                        <td style={styles.cell}>{product.sold}</td>
                        <td style={styles.cell}>{product.category}</td>
                        <td style={styles.cell}> {/* Thêm cột cho icon sửa và xóa */}
                            <FaEdit style={styles.icon} onClick={() => handleEdit(product.id)} />
                            <FaTrash style={styles.icon} onClick={() => handleDelete(product.id)} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const styles = {
    headerCell: {
        padding: '10px',
        borderBottom: '1px solid #ddd',
        textAlign: 'left',
    },
    row: {
        borderBottom: '1px solid #ddd',
    },
    cell: {
        padding: '10px',
    },
    icon: {
        margin: '0 5px', // Khoảng cách giữa các icon
        cursor: 'pointer', // Thay đổi con trỏ khi hover vào icon
    },
};

// Hàm xử lý khi click vào icon sửa
const handleEdit = (id) => {
    console.log('Chỉnh sửa sản phẩm với ID:', id);
};

// Hàm xử lý khi click vào icon xóa
const handleDelete = (id) => {
    console.log('Xóa sản phẩm với ID:', id);
};

export default ProductTable;
