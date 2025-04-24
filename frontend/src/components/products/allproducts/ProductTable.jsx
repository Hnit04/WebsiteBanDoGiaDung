// src/components/products/ProductTable.jsx
import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './ProductTable.css';

const ProductTable = ({ products }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    // Xử lý khi checkbox chọn tất cả được bật hoặc tắt
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allProductIds = products.map((product) => product.id);
            setSelectedProducts(allProductIds);
        } else {
            setSelectedProducts([]);
        }
    };

    // Xử lý khi checkbox cho từng sản phẩm được bật hoặc tắt
    const handleSelectProduct = (id) => {
        setSelectedProducts((prevSelected) => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter((productId) => productId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };
    const handleSelectDelete = () => {
        // Xử lý xóa sản phẩm (giả lập ở đây)
        console.log('Sản phẩm sẽ bị xóa:', selectedProducts);
        setShowConfirmDelete(false);
        // Sau khi xóa xong, reset selectedProducts
        setSelectedProducts([]);
    };

    const handleConfirmDelete = () => {
        setShowConfirmDelete(true);
    };

    const handleCancelDelete = () => {
        setShowConfirmDelete(false);
    };
    
    return (
        <div>
            <div>
                <button className={`button-delete ${selectedProducts.length > 0 ? 'enabled' : ''}`}
                    onClick={handleConfirmDelete} 
                    disabled={selectedProducts.length === 0}
                >
                    Xóa {selectedProducts.length} sản phẩm
                </button>
            </div>
            {showConfirmDelete && (
                <div className="confirm-delete-modal">
                    <p>Bạn có chắc chắn muốn xóa các sản phẩm đã chọn?</p>
                    <div className="button-group">
                        <button onClick={handleSelectDelete}>Có</button>
                        <button onClick={handleCancelDelete}>Không</button>
                    </div>
                </div>
            )}
            <table className="product-table">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedProducts.length === products.length}
                            />
                        </th>
                        <th>TÊN SẢN PHẨM</th>
                        <th>SỐ LƯỢNG</th>
                        <th>GIÁ</th>
                        <th>ĐÃ BÁN</th>
                        <th>LOẠI SẢN PHẨM</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedProducts.includes(product.id)}
                                    onChange={() => handleSelectProduct(product.id)}
                                />
                            </td>
                            <td>{product.name}</td>
                            <td>{product.quantity}</td>
                            <td>{product.price}</td>
                            <td>{product.sold}</td>
                            <td>{product.category}</td>
                            <td>
                                <FaEdit className="icon" onClick={() => handleEdit(product.id)} />
                                |
                                <FaTrash className="icon" onClick={() => handleDelete(product.id)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
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
