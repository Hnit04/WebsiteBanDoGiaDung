// src/components/products/ProductTable.jsx
import React from 'react';
// import { FaEdit, FaTrash } from 'react-icons/fa';
import './DiscountProductsTable.css';
const DiscountProductsTable = ({ products }) => {
    
    return (
        <div>
            
            
            <table className="discount-table">
                <thead>
                    <tr>
                        
                        <th>TÊN SẢN PHẨM</th>
                        <th>GIÁ CỐ ĐỊNH</th>
                        <th>GIÁ KHUYẾN MÃI</th>
                        <th>GIÁ BÁN</th>
                        <th>TRẠNG THÁI</th>
                       
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product.id}>
                            
                            <td>{product.name}</td>
                            <td>{product.fixed_price}</td>
                            <td>{product.discount_price}</td>
                            <td>{product.sold_price}</td>
                            <td>{product.status_discount}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};



export default DiscountProductsTable;
