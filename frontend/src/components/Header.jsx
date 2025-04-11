import React, { useEffect, useState } from 'react';
import { getCart } from '../assets/js/cartManager'; // Đường dẫn tùy chỉnh

const Header = ({ onCartClick }) => {
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        const cart = getCart();
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        setTotalItems(itemCount);
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 py-3">
            <div className="container mx-auto flex items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <i className="fa fa-heart text-pink-600 text-3xl"></i>
                    <h1 className="text-pink-600 text-lg font-bold ml-2">HomeCraft</h1>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 mx-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-lg p-2 flex-1"
                    />
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-12">
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
                    <a href="#login" className="text-gray-700 hover:text-pink-600">Login</a>
                    <button className="bg-pink-600 text-white rounded-lg px-4 py-2">Subscribe</button>
                </nav>
            </div>
        </header>
    );
};

export default Header;