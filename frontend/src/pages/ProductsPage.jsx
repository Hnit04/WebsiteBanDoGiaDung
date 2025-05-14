import React, { useState, useEffect } from 'react';
import { products } from '../assets/js/productData.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from "react-router-dom" // Import Link


const ProductsPage = ({ onProductClick, selectedCategory = 'all' }) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentCategory, setCurrentCategory] = useState(selectedCategory);
    const [currentSort, setCurrentSort] = useState('default');

    useEffect(() => {
        setCurrentCategory(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        filterProducts();
    }, [currentCategory, currentSort]);

    const filterProducts = () => {
        let result = [...products];

        if (currentCategory !== 'all') {
            result = result.filter(product => product.category === currentCategory);
        }

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

        setFilteredProducts(result);
    };

    const handleCategoryChange = (e) => {
        setCurrentCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setCurrentSort(e.target.value);
    };

    return (
        <section id="products" className="py-5 bg-gray-100">
            <div className="container mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                    <h2 className="text-2xl font-semibold mb-3 md:mb-0">Sản phẩm nổi bật</h2>
                    <div className="flex flex-col md:flex-row gap-2">
                        <select
                            value={currentCategory}
                            onChange={handleCategoryChange}
                            className="form-select border border-gray-300 rounded-md p-2"
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="kitchen">Nhà bếp</option>
                            <option value="bathroom">Phòng tắm</option>
                            <option value="bedroom">Phòng ngủ</option>
                            <option value="livingroom">Phòng khách</option>
                        </select>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="form-select border border-gray-300 rounded-md p-2"
                        >
                            <option value="default">Sắp xếp</option>
                            <option value="priceLow">Giá: Thấp đến cao</option>
                            <option value="priceHigh">Giá: Cao đến thấp</option>
                            <option value="nameAZ">Tên: A-Z</option>
                            <option value="nameZA">Tên: Z-A</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.length === 0 ? (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            <i className="fa fa-search text-5xl mb-4"></i>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <div key={product.id} className="col">
                                <Link to={`/product/${product.id}`} className="block">
                                <ProductCard
                                    product={product}
                                />
                                </Link>

                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsPage;