import React, { useEffect, useState } from 'react';
import { getCart } from '../assets/js/cartManager';
import ModalLogin from './ModalLogin';
import ModalSubscribe from './ModalSubscribe';

const Header = ({ onCartClick }) => {
    const [totalItems, setTotalItems] = useState(0);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSubscribeModal, setShowSubscribeModal] = useState(false);
    const [username, setUsername] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        setTotalItems(itemCount);
    }, []);

    const handleLogin = (user) => {
        setUsername(user);
        setShowLoginModal(false);
    };

    const handleRegister = (user) => {
        setUsername(user); // tự động đăng nhập
        setShowSubscribeModal(false);
    };

    const handleLogout = () => {
        setUsername(null);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <>
            <header className="bg-white shadow-sm sticky top-0 py-3 justify-between border border-amber-600 z-40">
                <div className="container mx-auto flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center">
                        <i className="fa fa-heart text-pink-600 text-3xl"></i>
                        <h1 className="text-pink-600 text-lg font-bold ml-2">HomeCraft</h1>
                    </div>

                    {/* Search */}
                    <div className="hidden md:flex flex-1 mx-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="border border-gray-300 rounded-lg p-2 flex-1"
                        />
                    </div>

                    {/* Nav */}
                    <nav className="hidden md:flex items-center space-x-12 relative">
                        <a href="#recipes" className="text-gray-700 hover:text-pink-600">Recipes</a>
                        <a href="#ingredients" className="text-gray-700 hover:text-pink-600">Ingredients</a>
                        <a href="#categories" className="text-gray-700 hover:text-pink-600">Categories</a>

                        <button onClick={onCartClick} className="text-gray-700 hover:text-pink-600 relative">
                            <i className="fa fa-shopping-cart text-xl"></i>
                            {totalItems > 0 && (
                                <span className="absolute bottom-5 left-5 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>

                        {!username ? (
                            <>
                                <button onClick={() => setShowLoginModal(true)} className="text-gray-700 hover:text-pink-600">Login</button>
                                <button onClick={() => setShowSubscribeModal(true)} className="bg-pink-600 text-white rounded-lg px-4 py-2">Subscribe</button>
                            </>
                        ) : (
                            <div className="relative">
                                <button onClick={toggleDropdown} className="text-gray-700 font-medium flex items-center space-x-2">
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

            {/* Modal Login */}
            {showLoginModal && (
                <ModalLogin
                    onClose={() => setShowLoginModal(false)}
                    onLogin={handleLogin}
                />
            )}

            {/* Modal Subscribe */}
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
