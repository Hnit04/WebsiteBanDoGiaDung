import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import { Link } from "react-router-dom";

// Hàm debounce để giảm tần suất gọi hàm tìm kiếm
const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const ProductsPage = ({ onProductClick, selectedCategory = 'all' }) => {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [currentCategory, setCurrentCategory] = useState(selectedCategory);
    const [currentSort, setCurrentSort] = useState('default');
    const [searchTerm, setSearchTerm] = useState(''); // State cho từ khóa tìm kiếm
    const [priceRange, setPriceRange] = useState({ minPrice: '', maxPrice: '' }); // State cho khoảng giá
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

    // Tự động lọc sản phẩm khi các tiêu chí tìm kiếm thay đổi
    useEffect(() => {
        filterProducts();
    }, [currentCategory, currentSort, searchTerm, priceRange, allProducts]);

    const filterProducts = () => {
        let result = [...allProducts];

        // Lọc theo từ khóa tìm kiếm (tên sản phẩm)
        if (searchTerm.trim()) {
            result = result.filter(product =>
                product.productName.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Lọc theo danh mục
        if (currentCategory !== 'all') {
            result = result.filter(product => product.categoryId === currentCategory);
        }

        // Lọc theo khoảng giá
        const minPrice = priceRange.minPrice ? parseFloat(priceRange.minPrice) : 0;
        const maxPrice = priceRange.maxPrice ? parseFloat(priceRange.maxPrice) : Infinity;
        if (priceRange.minPrice || priceRange.maxPrice) {
            result = result.filter(product =>
                product.salePrice >= minPrice && product.salePrice <= maxPrice
            );
        }

        // Sắp xếp
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

    // Debounce tìm kiếm theo tên để tránh gọi quá nhiều lần
    const debouncedFilter = debounce(() => filterProducts(), 300);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
        debouncedFilter();
    };

    const handleCategoryChange = (e) => {
        setCurrentCategory(e.target.value);
    };

    const handleSortChange = (e) => {
        setCurrentSort(e.target.value);
    };

    const handlePriceRangeChange = (e) => {
        const { name, value } = e.target;
        setPriceRange(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
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
                <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                    <h2 className="text-2xl font-semibold mb-3 md:mb-0">Sản phẩm nổi bật</h2>
                    <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                        {/* Tìm kiếm theo tên */}
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="border border-gray-300 rounded-md p-2 w-full md:w-64 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {/* Lọc theo danh mục */}
                        <select
                            value={currentCategory}
                            onChange={handleCategoryChange}
                            className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="kitchen">Nhà bếp</option>
                            <option value="bathroom">Phòng tắm</option>
                            <option value="bedroom">Phòng ngủ</option>
                            <option value="livingroom">Phòng khách</option>
                        </select>
                        {/* Lọc theo khoảng giá */}
                        <div className="flex gap-2">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Giá từ"
                                value={priceRange.minPrice}
                                onChange={handlePriceRangeChange}
                                className="border border-gray-300 rounded-md p-2 w-full md:w-28 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                            />
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Giá đến"
                                value={priceRange.maxPrice}
                                onChange={handlePriceRangeChange}
                                className="border border-gray-300 rounded-md p-2 w-full md:w-28 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                min="0"
                            />
                        </div>
                        {/* Sắp xếp */}
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="border border-gray-300 rounded-md p-2 w-full md:w-auto"
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
                                        <ProductCard product={product} />
                                    </div>

                                    {/* Dòng chữ nằm trên, không bị mờ */}
                                    {product.quantityInStock === 0 && (
                                        <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
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