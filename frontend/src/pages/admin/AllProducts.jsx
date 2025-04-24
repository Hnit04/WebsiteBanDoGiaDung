// src/pages/admin/AdminDashboard.jsx
import React, {useState, useEffect} from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Header from '../../components/header/Header';
import ProductHeader from '../../components/products/ProductHeader';
import ProductHeader1 from '../../components/products/ProductHeader1';
import ProductTable from '../../components/products/ProductTable';
const AllProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Giả lập dữ liệu mẫu từ cơ sở dữ liệu
        setProducts([
            { name: 'Sản phẩm A', quantity: 50, price: '500,000₫', sold: 20, category: 'Danh mục 1' },
            { name: 'Sản phẩm B', quantity: 30, price: '300,000₫', sold: 10, category: 'Danh mục 2' },
            { name: 'Sản phẩm C', quantity: 20, price: '700,000₫', sold: 5, category: 'Danh mục 1' },
            // Các sản phẩm khác...
        ]);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#f0f2f5'}}>
            <Header /> {/* Header chiếm chiều rộng đầy đủ */}
            <div style={{background: '#f0f2f5'}}>
                <div style={{ display: 'flex', flex: 1, paddingTop: '85px' }}>
                    <Sidebar />
                    <div style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                        <ProductHeader />
                        <ProductHeader1 productCount={products.length} />
                        <ProductTable products={products} />
                    </div>
                </div>                
            </div>

        </div>
    );
};

export default AllProducts;
