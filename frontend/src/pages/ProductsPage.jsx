import React, { useState, useEffect } from 'react';
import { products } from '../assets/js/productData.jsx';
import ProductCard from '../components/ProductCard.jsx';

const ProductsPage = ({ onProductClick, selectedCategory = 'all' }) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentCategory, setCurrentCategory] = useState(selectedCategory);
    const [currentSort, setCurrentSort] = useState('default');

    useEffect(() => {
        // Update category when prop changes
        setCurrentCategory(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        // Filter and sort products when criteria change
        filterProducts();
    }, [currentCategory, currentSort]);

    const filterProducts = () => {
        let result = [...products];

        // Apply category filter
        if (currentCategory !== 'all') {
            result = result.filter(product => product.category === currentCategory);
        }

        // Apply sort filter
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
                // No sorting
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
        <section id="products" className="py-5 bg-light">
            <div className="container">
                <div className="d-flex flex-column flex-md-row align-items-center justify-content-md-between mb-4">
                    <h2 className="h3 mb-3 mb-md-0">Sản phẩm nổi bật</h2>
                    <div className="d-flex flex-column flex-md-row gap-2">
                        <select
                            value={currentCategory}
                            onChange={handleCategoryChange}
                            className="form-select"
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
                            className="form-select"
                        >
                            <option value="default">Sắp xếp</option>
                            <option value="priceLow">Giá: Thấp đến cao</option>
                            <option value="priceHigh">Giá: Cao đến thấp</option>
                            <option value="nameAZ">Tên: A-Z</option>
                            <option value="nameZA">Tên: Z-A</option>
                        </select>
                    </div>
                </div>

                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
                    {filteredProducts.length === 0 ? (
                        <div className="col-12 text-center py-8 text-secondary">
                            <i className="fa fa-search fs-1 mb-4"></i>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <div className="col" key={product.id}>
                                <ProductCard
                                    product={product}
                                    onClick={onProductClick}
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsPage;