import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from "react-router-dom";

const ProductsPage = ({ onProductClick, selectedCategory = 'all' }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(selectedCategory);
    const [currentSort, setCurrentSort] = useState('default');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [allProducts, setAllProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product");
                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu sản phẩm");
                }
                const data = await response.json();
                const visibleProducts = data.filter(product => product.show === true);
                setAllProducts(visibleProducts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    useEffect(() => {
        setCurrentCategory(selectedCategory);
    }, [selectedCategory]);

    useEffect(() => {
        filterProducts();
    }, [currentCategory, currentSort, allProducts]);

    const filterProducts = () => {
        let result = [...allProducts];

        if (currentCategory !== 'all') {
            result = result.filter(product => product.categoryId === currentCategory);
        }

        switch (currentSort) {
            case 'priceLow':
                result.sort((a, b) => a.salePrice - b.salePrice);
                break;
            case 'priceHigh':
                result.sort((a, b) => b.salePrice - a.salePrice);
                break;
            case 'nameAZ':
                result.sort((a, b) => a.productName.localeCompare(b.productName));
                break;
            case 'nameZA':
                result.sort((a, b) => b.productName.localeCompare(a.productName));
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-500 text-lg">Lỗi: {error}</p>
            </div>
        );
    }

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
                            <div key={product.id} className="col relative">
                                <Link to={`/product/${product.id}`} className="block">
                                    {/* Vùng bị làm mờ */}
                                    <div className={`${product.quantityInStock === 0 ? 'opacity-50' : ''}`}>
                                        <ProductCard product={product}/>
                                    </div>

                                    {/* Dòng chữ nằm trên, không bị mờ */}
                                    {product.quantityInStock === 0 && (
                                        <div
                                            className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                                            Hết hàng
                                        </div>
                                    )}
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