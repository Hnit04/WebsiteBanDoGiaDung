"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { products } from "../assets/js/productData"

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    useEffect(() => {
        const loggedInStatus = localStorage.getItem("isLoggedIn") === "true"
        setIsLoggedIn(loggedInStatus)

        const storedUserInfo = localStorage.getItem("userInfo")
        if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo))
        }

        // Add event listener for storage changes
        const handleStorageChange = () => {
            const updatedLoggedInStatus = localStorage.getItem("isLoggedIn") === "true"
            setIsLoggedIn(updatedLoggedInStatus)

            const updatedUserInfo = localStorage.getItem("userInfo")
            if (updatedUserInfo) {
                setUserInfo(JSON.parse(updatedUserInfo))
            } else {
                setUserInfo(null)
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => {
            window.removeEventListener("storage", handleStorageChange)
        }
    }, [])

    useEffect(() => {
        if (searchText.trim()) {
            const matched = products.filter((product) => product.name.toLowerCase().includes(searchText.toLowerCase()))
            const suggestionsWithImage = matched.slice(0, 10).map((product) => ({
                id: product.id,
                name: product.name,
                image: "/" + product.image,
            }))
            setSuggestions(suggestionsWithImage)
        } else {
            setSuggestions([])
        }
    }, [searchText])

    const handleSuggestionClick = (id) => {
        navigate(`/product/${id}`)
        setSearchText("")
        setSuggestions([])
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchText.trim()) {
            navigate(`/products?search=${searchText}`)
        }
    }

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn")
        localStorage.removeItem("userInfo")
        setIsLoggedIn(false)
        setUserInfo(null)
        setIsUserMenuOpen(false)
        navigate("/login") // Chuyển hướng về trang đăng nhập sau khi đăng xuất
    }

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    return (
        <header className="w-full bg-gray-900 text-white">
            {/* Top bar */}
            <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                <div className="font-medium">Home Craft</div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                        <span>0326-829-327</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>08:00 - 18:00</span>
                    </div>
                </div>
            </div>

            {/* Main header */}
            <div className="bg-white text-gray-900 py-4 px-4 flex justify-between items-center shadow-sm relative">
                {/* Search */}
                <div className="flex-1 max-w-xl relative">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Tìm kiếm sản phẩm..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                        />
                        <button
                            type="submit"
                            className="absolute right-0 top-0 h-full bg-gray-900 hover:bg-gray-800 text-white px-4 rounded-r-md"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </button>
                    </form>

                    {/* Suggestions dropdown */}
                    {suggestions.length > 0 && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion.id)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                >
                                    {suggestion.image && (
                                        <img
                                            src={suggestion.image || "/placeholder.svg"}
                                            alt={suggestion.name}
                                            className="w-8 h-8 mr-2 rounded object-cover"
                                        />
                                    )}
                                    <span>{suggestion.name}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Navigation */}
                <div className="hidden md:flex items-center space-x-6 ml-6">
                    <Link to="/" className="py-2 font-medium hover:text-blue-600">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="py-2 font-medium hover:text-blue-600">
                        Sản phẩm
                    </Link>
                    <Link to="/contact" className="py-2 font-medium hover:text-blue-600">
                        Liên hệ
                    </Link>
                    <Link to="/about" className="py-2 font-medium hover:text-blue-600">
                        Giới thiệu
                    </Link>
                    {/* Hide Register and Login when logged in */}
                    {!isLoggedIn && (
                        <>
                            <Link to="/register" className="py-2 font-medium hover:text-blue-600">
                                Đăng ký
                            </Link>
                            <Link to="/login" className="py-2 font-medium hover:text-blue-600">
                                Đăng nhập
                            </Link>
                        </>
                    )}
                    {isLoggedIn && userInfo && (
                        <div className="relative">
                            <button onClick={toggleUserMenu} className="py-2 font-medium hover:text-blue-600 focus:outline-none">
                                {userInfo.username || userInfo.name} {/* Handle both property names */}
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                        Thông tin cá nhân
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Cart */}
                <div className="ml-4">
                    <Link
                        to="/cart"
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-100"
                    >
                        🛒<span className="ml-2">GIỎ HÀNG</span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden ml-4">
                    <button className="p-2 hover:bg-gray-100 rounded-md" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        ☰
                    </button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-200 py-2">
                    <Link to="/" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Trang chủ
                    </Link>
                    <Link to="/products" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Sản phẩm
                    </Link>
                    <Link to="/contact" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Liên hệ
                    </Link>
                    <Link to="/about" className="block px-4 py-2 text-gray-900 hover:bg-gray-100">
                        Giới thiệu
                    </Link>
                    {/* Hide Register and Login when logged in */}
                    {!isLoggedIn && (
                        <>
                            <Link to="/register" className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100">
                                Đăng ký
                            </Link>
                            <Link to="/login" className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100">
                                Đăng nhập
                            </Link>
                        </>
                    )}
                    {isLoggedIn && userInfo && (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none"
                            >
                                {userInfo.username || userInfo.name}
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20">
                                    <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                                        Thông tin cá nhân
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 focus:outline-none"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
