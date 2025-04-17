"use client"

import { useState } from "react";
import { Link } from "react-router-dom"; // Import Link từ react-router-dom

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="w-full bg-gray-900 text-white">
            {/* Top bar */}
            <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                <div className="font-medium">Home Craft</div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        {/* Phone icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        <span>0326-829-327</span>
                    </div>
                    <div className="flex items-center gap-1">
                        {/* Clock icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>08:00 - 18:00</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="bg-white text-gray-900 py-4 px-4 flex justify-between items-center shadow-sm">
                {/* Search */}
                <div className="flex-1 max-w-xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        <button className="absolute right-0 top-0 h-full bg-gray-900 hover:bg-gray-800 text-white px-4 rounded-r-md">
                            {/* Search icon */}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-6 ml-6">
                    <Link to="/" className="py-2 font-medium hover:text-blue-600">Trang chủ</Link>
                    <Link to="/products" className="py-2 font-medium hover:text-blue-600">Sản phẩm</Link>
                    <Link to="/contact" className="py-2 font-medium hover:text-blue-600">Liên hệ</Link>
                    <Link to="/about" className="py-2 font-medium hover:text-blue-600">Giới thiệu</Link>
                    <Link to="/register" className="py-2 font-medium hover:text-blue-600">Đăng ký</Link>
                    <Link to="/login" className="py-2 font-medium hover:text-blue-600">Đăng nhập</Link>
                </div>

                {/* Cart */}
                <div className="ml-4">
                    <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-100">
                        {/* Shopping bag icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 0 1-8 0"></path>
                        </svg>
                        <span>GIỎ HÀNG</span>
                    </button>
                </div>

                <div className="md:hidden ml-4">
                    <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {/* Menu icon for mobile */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-2">
                    <Link to="/" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Trang chủ</Link>
                    <Link to="/products" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Sản phẩm</Link>
                    <Link to="/contact" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Liên hệ</Link>
                    <Link to="/about" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">Giới thiệu</Link>
                    <Link to="/register" className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100">Đăng ký</Link>
                    <Link to="/login" className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100">Đăng nhập</Link>
                </div>
            )}
        </header>
    )
}