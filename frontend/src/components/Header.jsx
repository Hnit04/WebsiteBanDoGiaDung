import React, { useState } from "react";

const Header = ({ onCartClick }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                {/* Logo */}
                <div className="flex items-center">
                    <i className="fa fa-home text-blue-500 text-2xl mr-2"></i>
                    <h1 className="text-lg font-bold text-blue-500">HomeCraft</h1>
                </div>

                {/* Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <a href="#" className="text-gray-700 hover:text-blue-500 font-medium">
                        Trang chủ
                    </a>
                    <a href="#products" className="text-gray-700 hover:text-blue-500 font-medium">
                        Sản phẩm
                    </a>
                    <a href="#categories" className="text-gray-700 hover:text-blue-500 font-medium">
                        Danh mục
                    </a>
                    <a href="#about" className="text-gray-700 hover:text-blue-500 font-medium">
                        Giới thiệu
                    </a>
                </nav>

                {/* Actions */}
                <div className="flex items-center space-x-4">
                    {/* Cart Button */}
                    <div className="relative">
                        <button onClick={onCartClick} className="text-gray-700 hover:text-blue-500 relative">
                            <i className="fa fa-shopping-cart text-xl"></i>
                            <span
                                id="cartBadge"
                                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center text-xs rounded-full transform translate-x-1/2 -translate-y-1/2"
                            >
                0
              </span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button onClick={toggleMobileMenu} className="md:hidden text-gray-700">
                        <i className="fa fa-bars text-xl"></i>
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden absolute top-full left-0 w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
                    isMobileMenuOpen ? "block" : "hidden"
                }`}
            >
                <a href="#" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">
                    Trang chủ
                </a>
                <a href="#products" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">
                    Sản phẩm
                </a>
                <a href="#categories" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">
                    Danh mục
                </a>
                <a href="#about" className="block py-3 px-4 text-gray-700 hover:bg-gray-100">
                    Giới thiệu
                </a>
            </div>
        </header>
    );
};

export default Header;
