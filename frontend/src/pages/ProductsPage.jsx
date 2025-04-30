import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { products } from '../assets/js/productData.jsx';
import ProductCard from '../components/ProductCard.jsx'; // Có thể không cần component này nữa
import placeholderImage from '../assets/img.png'; // Đường dẫn đến ảnh placeholder nếu cần

const ProductsPage = ({ onProductClick }) => {
    const [filteredProducts, setFilteredProducts] = useState(products);
    const [currentCategory, setCurrentCategory] = useState('all');
    const [currentSort, setCurrentSort] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const initialSearchTerm = searchParams.get('search') || '';
        setSearchTerm(initialSearchTerm);
    }, [searchParams]);

    useEffect(() => {
        filterProducts();
    }, [currentCategory, currentSort, searchTerm]);

    const filterProducts = () => {
        let result = [...products];

        if (currentCategory !== 'all') {
            result = result.filter(product => product.category === currentCategory);
        }

        if (searchTerm.trim()) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
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

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    return (
        <section className="py-12 bg-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0 text-center md:text-left">Tất cả sản phẩm</h2>
                    <div className="flex flex-col md:flex-row gap-4">
                        <input
                            type="text"
                            placeholder="Tìm kiếm sản phẩm..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="form-input border border-gray-300 rounded-md p-3 w-full md:w-64"
                        />
                        <select
                            value={currentCategory}
                            onChange={handleCategoryChange}
                            className="form-select border border-gray-300 rounded-md p-3"
                        >
                            <option value="all">Tất cả danh mục</option>
                            <option value="Kitchen">Nhà bếp</option>
                            <option value="Bathroom">Phòng tắm</option>
                            <option value="Bedroom">Phòng ngủ</option>
                            <option value="Livingroom">Phòng khách</option>
                        </select>
                        <select
                            value={currentSort}
                            onChange={handleSortChange}
                            className="form-select border border-gray-300 rounded-md p-3"
                        >
                            <option value="default">Sắp xếp</option>
                            <option value="priceLow">Giá: Thấp đến cao</option>
                            <option value="priceHigh">Giá: Cao đến thấp</option>
                            <option value="nameAZ">Tên: A-Z</option>
                            <option value="nameZA">Tên: Z-A</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {filteredProducts.map((product) => (
                        <Link
                            to={`/product/${product.id}`}
                            key={product.id}
                            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition transform hover:scale-105 duration-300"
                        >
                            <div className="relative">
                                <img
                                    src={product.image || placeholderImage}
                                    alt={product.name}
                                    className="w-full h-48 object-contain"
                                />
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-sm font-semibold rounded-md px-2 py-1">
                {product.category}
            </span>
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    {product.description.substring(0, 60)}...
                                </p>
                                <div className="flex items-center justify-between">
                <span className="text-red-500 font-bold text-xl">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </span>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md">
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-8 text-gray-500">
                            <i className="fa fa-search text-5xl mb-4"></i>
                            <p>Không tìm thấy sản phẩm phù hợp.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProductsPage;