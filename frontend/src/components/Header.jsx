import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import axios from 'axios'; // Không cần thiết nữa nếu chỉ dùng dữ liệu mẫu
import { getCart } from '../assets/js/cartManager';
import ModalLogin from './ModalLogin';
import ModalSubscribe from './ModalSubscribe';
import { products } from '../assets/js/productData'; // Import dữ liệu sản phẩm mẫu

const Header = ({ onCartClick }) => {
    const [totalItems, setTotalItems] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [username, setUsername] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allProducts, setAllProducts] = useState(products); // Sử dụng trực tiếp dữ liệu mẫu

    useEffect(() => {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        setTotalItems(itemCount);

        const savedUsername = localStorage.getItem('username');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn && savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    const handleLogin = (user) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        setUsername(user);
        setShowLoginModal(false);
    };

    const handleRegister = (user) => {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', user);
        setUsername(user);
        setShowSubscribeModal(false);
    };

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        setUsername(null);
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

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 py-3 justify-between border border-amber-600 z-40">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">

                        <Link to="/" className=" text-pink-600 text-lg font-bold ml-2 items-center"><i
                            className="fa fa-heart text-pink-600 text-3xl"></i> <span className="text-2xl font-bold">HomeCraft</span></Link>
                        {/*<Link to="/" className=" text-pink-600 text-lg font-bold ml-2">HomeCraft</Link>*/}
                    </div>

                    {/* Search */}
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

                    {/* Nav */}
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

                        {!username ? (
                            <>
                                <button onClick={() => setShowLoginModal(true)}
                                        className="text-gray-700 hover:text-pink-600">Login
                                </button>
                                <button onClick={() => setShowSubscribeModal(true)}
                                        className="bg-pink-600 text-white rounded-lg px-4 py-2">Subscribe
                                </button>
                            </>
                        ) : (
                            <div className="relative">
                                <button onClick={toggleDropdown}
                                        className="text-gray-700 font-medium flex items-center space-x-2">
                                    <span>Hi, {username}</span>
                                    <i className="fa fa-caret-down ml-1"></i>
                                </button>
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2 z-50">
                                        <button
                                            onClick={() => alert('Tới trang Account')}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                        >
                                            Account
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </nav>
                </div>
            </header>

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