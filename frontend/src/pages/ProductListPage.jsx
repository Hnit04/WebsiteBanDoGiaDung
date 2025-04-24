import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../assets/js/productData';

const ProductListPage = () => {
    // 1. Nhóm sản phẩm theo danh mục
    const productsByCategory = products.reduce((acc, product) => {
        const category = product.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(product);
        return acc;
    }, {});

    return (
        <div className="container mx-auto mt-8">
            <h1 className="text-2xl font-bold mb-4">Danh sách sản phẩm theo danh mục</h1>
            {Object.keys(productsByCategory).map(category => (
                <div key={category} className="mb-6">
                    <h2 className="text-xl font-semibold mb-2 capitalize">{category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productsByCategory[category].map(product => (
                            <div key={product.id} className="bg-white shadow-md rounded-lg p-4">
                                <Link to={`/product/${product.id}`}>
                                    <img src={product.image} alt={product.name} className="w-full h-32 object-contain rounded-md mb-2" />
                                    <h3 className="text-sm font-semibold text-gray-700">{product.name}</h3>
                                    <p className="text-gray-600 text-xs">Giá: {product.price}</p>
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductListPage;