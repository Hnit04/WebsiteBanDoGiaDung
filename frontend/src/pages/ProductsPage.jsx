import React, { useState, useEffect, useMemo } from 'react';
import { products } from '../assets/js/productData.jsx';
import ProductCard from '../components/ProductCard.jsx';

const ProductsPage = ({ onProductClick, selectedCategory = 'all' }) => {
    const [currentCategory, setCurrentCategory] = useState(selectedCategory);
    const [currentSort, setCurrentSort] = useState('default');

    useEffect(() => {
        setCurrentCategory(selectedCategory);
    }, [selectedCategory]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Lọc theo danh mục
        if (currentCategory !== 'all') {
            result = result.filter(product => product.category === currentCategory);
        }

        // Sắp xếp sản phẩm
        switch (currentSort) {
            case 'priceLow':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'priceHigh':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'nameAZ':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'nameZA':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
            default:
                break;
        }

        return result;
    }, [currentCategory, currentSort]);

    return (
        <section id="products" className="py-8 bg-gray-50">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <h2 className="text-xl font-semibold mb-4 md:mb-0">Sản phẩm nổi bật</h2>

                    <div className="flex flex-col md:flex-row gap-3">
                        {/* Bộ lọc danh mục */}
                        <select
                            value={currentCategory}
                            onChange={(e) => setCurrentCategory(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="kitchen">Nhà bếp</option>
                            <option value="bathroom">Phòng tắm</option>
                            <option value="bedroom">Phòng ngủ</option>
                            <option value="livingroom">Phòng khách</option>
                        </select>

                        {/* Bộ lọc sắp xếp */}
                        <select
                            value={currentSort}
                            onChange={(e) => setCurrentSort(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        >
                            <option value="default">Sắp xếp</option>
                            <option value="priceLow">Giá: Thấp đến cao</option>
                            <option value="priceHigh">Giá: Cao đến thấp</option>
                            <option value="nameAZ">Tên: A-Z</option>
                            <option value="nameZA">Tên: Z-A</option>
                        </select>
                    </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-12">
                            <i className="fas fa-search text-4xl mb-4"></i>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onClick={() => onProductClick?.(product)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsPage;
