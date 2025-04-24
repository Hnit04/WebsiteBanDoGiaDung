import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCart } from '../assets/js/cartManager';
import ModalLogin from './ModalLogin';
import ModalSubscribe from './ModalSubscribe';
import { products } from '../assets/js/productData';

const Header = ({ onCartClick }) => {
    const [totalItems, setTotalItems] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [username, setUsername] = useState(null);
    const [role, setRole] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState(products);

    useEffect(() => {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        setTotalItems(itemCount);

        const savedUsername = localStorage.getItem('username');
        const savedRole = localStorage.getItem('role');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && savedUsername && savedRole) {
            setUsername(savedUsername);
            setRole(savedRole);
        }
    }, []);

    const handleLogin = (user, userRole) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        localStorage.setItem('role', userRole);
        setUsername(user);
        setRole(userRole);
        setShowLoginModal(false);
    };

    const handleRegister = (user) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        localStorage.setItem('role', 'customer');
        setUsername(user);
        setRole('customer');
        setShowSubscribeModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
        setUsername(null);
        setRole(null);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchInput(value);

        if (value.trim() === '') {
            setSearchResults([]);
            return;
        }

        const filtered = allProducts.filter(product =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        setSearchResults(filtered);
    };

    // Render header cho khách hàng
    const renderCustomerHeader = () => (
        <header className="bg-white shadow-sm sticky top-0 py-3 border border-blue-300 z-40">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo khách hàng */}
                <div className="flex items-center">
                    <Link to="/" className=" text-pink-600 text-lg font-bold ml-2 items-center">
                        <i className="fa fa-heart text-pink-600 text-3xl"></i>
                        <span className="text-2xl font-bold">HomeCraft</span>
                    </Link>
                </div>

                {/* Search cho khách hàng */}
                <div className="hidden md:flex flex-1 mx-4 relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                    />
                    {searchInput && searchResults.length > 0 && (
                        <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md w-full z-50 max-h-60 overflow-y-auto">
                            {searchResults.map(product => (
                                <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                    onClick={() => window.location.href = `/product/${product.id}`}
                                >
                                    <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                    <span className="text-sm text-gray-700">{product.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Nav khách hàng */}
                <nav className="hidden md:flex items-center space-x-8 relative">
                    <Link to="/products" className="text-gray-700 hover:text-blue-600">Sản Phẩm</Link>
                    <Link to="/collections" className="text-gray-700 hover:text-blue-600">Bộ Sưu Tập</Link>
                    <Link to="/sale" className="text-red-500 hover:text-blue-600">Khuyến Mãi</Link>

                    <button onClick={onCartClick} className="text-gray-700 hover:text-blue-600 relative">
                        <i className="fa fa-shopping-cart text-xl"></i>
                        {totalItems > 0 && (
                            <span
                                className="absolute bottom-5 left-5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                {totalItems > 99 ? '99+' : totalItems}
                            </span>
                        )}
                    </button>

                    <div className="relative">
                        <button onClick={toggleDropdown}
                                className="text-gray-700 font-medium flex items-center space-x-2">
                            <span>{username ? `Hi, ${username}` : 'Tài khoản'}</span>
                            <i className="fa fa-caret-down ml-1"></i>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                                <Link to="/customer/profile" className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                                    Thông tin cá nhân
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );

    // Render header cho admin
    const renderAdminHeader = () => (
        <header className="bg-gray-800 shadow-md sticky top-0 py-3 border border-red-500 z-40">
            <div className="container mx-auto flex items-center justify-between">
                {/* Logo admin */}
                <div className="flex items-center">
                    <Link to="/" className=" text-pink-600 text-lg font-bold ml-2 items-center">
                        <i className="fa fa-heart text-pink-600 text-3xl"></i>
                        <span className="text-2xl font-bold">HomeCraft</span>
                    </Link>
                </div>

                {/* Search cho khách hàng */}
                <div className="hidden md:flex flex-1 mx-4 relative">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={handleSearchChange}
                        placeholder="Tìm kiếm sản phẩm..."
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                    />
                    {searchInput && searchResults.length > 0 && (
                        <div
                            className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md w-full z-50 max-h-60 overflow-y-auto">
                            {searchResults.map(product => (
                                <div
                                    key={product.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                    onClick={() => window.location.href = `/product/${product.id}`}
                                >
                                    <img src={product.image} alt={product.name}
                                         className="w-10 h-10 object-cover rounded"/>
                                    <span className="text-sm text-gray-700">{product.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Nav admin */}
                <nav className="hidden md:flex items-center space-x-8 relative text-black">

                    <Link to="/admin/products" className=" text-black">Sản phẩm</Link>
                    <Link to="/admin/orders" className="text-black">Đơn hàng</Link>
                    <Link to="/admin/customers" className="text-black">Khách hàng</Link>
                    <Link to="/admin/reports" className="text-black">Báo cáo</Link>
                    <div className="relative">
                        <button onClick={toggleDropdown}
                                className="text-black font-medium flex items-center space-x-2">
                            <span>Hi, {username} (Admin)</span>
                            <i className="fa fa-caret-down ml-1"></i>
                        </button>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                                <Link to="/admin/profile"
                                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700">
                                    Thông tin cá nhân
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                >
                                    Đăng xuất
                                </button>
                            </div>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );

    return (
        <>
            {role === 'admin' ? renderAdminHeader() : (username ? renderCustomerHeader() : (
                <header className="bg-white shadow-sm sticky top-0 py-3 justify-between border border-amber-600 z-40">
                    <div className="container mx-auto flex items-center justify-between">
                        {/* Logo chung */}
                        <div className="flex items-center">
                            <Link to="/" className=" text-pink-600 text-lg font-bold ml-2 items-center"><i
                                className="fa fa-heart text-pink-600 text-3xl"></i> <span
                                className="text-2xl font-bold">HomeCraft</span></Link>
                        </div>

                        {/* Search chung */}
                        <div className="hidden md:flex flex-1 mx-4 relative">
                            <input
                                type="text"
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                className="border border-gray-300 rounded-lg p-2 flex-1"
                            />
                            {searchInput && searchResults.length > 0 && (
                                <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-lg shadow-md w-full z-50 max-h-60 overflow-y-auto">
                                    {searchResults.map(product => (
                                        <div
                                            key={product.id}
                                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-3"
                                            onClick={() => window.location.href = `/product/${product.id}`}
                                        >
                                            <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded" />
                                            <span className="text-sm text-gray-700">{product.name}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Nav chưa đăng nhập */}
                        <nav className="hidden md:flex items-center space-x-12 relative">
                            <Link to="/recipes" className="text-gray-700 hover:text-pink-600">Recipes</Link>
                            <Link to="/ingredients" className="text-gray-700 hover:text-pink-600">Ingredients</Link>
                            <Link to="/categories" className="text-gray-700 hover:text-pink-600">Categories</Link>
                            <Link to="/about" className="text-gray-700 hover:text-pink-600">About</Link>

                            <button onClick={onCartClick} className="text-gray-700 hover:text-pink-600 relative">
                                <i className="fa fa-shopping-cart text-xl"></i>
                                {totalItems > 0 && (
                                    <span
                                        className="absolute bottom-5 left-5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                        {totalItems > 99 ? '99+' : totalItems}
                                    </span>
                                )}
                            </button>

                            <button onClick={() => setShowLoginModal(true)}
                                    className="text-gray-700 hover:text-pink-600">Đăng nhập
                            </button>
                            <button onClick={() => setShowSubscribeModal(true)}
                                    className="bg-pink-600 text-white rounded-lg px-4 py-2">Đăng ký
                            </button>
                        </nav>
                    </div>
                </header>
            ))}

            {showLoginModal && (
                <ModalLogin
                    onClose={() => setShowLoginModal(false)}
                    onLogin={handleLogin}
                />
            )}

            {showSubscribeModal && (
                <ModalSubscribe
                    onClose={() => setShowSubscribeModal(false)}
                    onRegister={handleRegister}
                />
            )}
        </>
    );
};

export default Header;