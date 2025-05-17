"use client"

import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { getUserFromLocalStorage, clearUserFromLocalStorage } from "../assets/js/userData"
import debounce from "lodash/debounce"

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [searchText, setSearchText] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [cartCount, setCartCount] = useState(0)
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        const loggedInUser = getUserFromLocalStorage()
        if (loggedInUser) {
            setUser(loggedInUser)
            setIsLoggedIn(true)
            fetchCartCount(loggedInUser.id)
        } else {
            setUser(null)
            setIsLoggedIn(false)
            setCartCount(0)
        }
    }, [location.pathname])

    useEffect(() => {
        const handleCartUpdated = () => {
            const loggedInUser = getUserFromLocalStorage()
            if (loggedInUser) {
                fetchCartCount(loggedInUser.id)
            }
        }

        window.addEventListener("cartUpdated", handleCartUpdated)
        return () => {
            window.removeEventListener("cartUpdated", handleCartUpdated)
        }
    }, [])

    // Đóng user menu khi nhấp ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            const userMenu = document.querySelector(".user-menu")
            const userMenuButton = document.querySelector(".user-menu-button")

            if (
                userMenu &&
                userMenuButton &&
                !userMenu.contains(event.target) &&
                !userMenuButton.contains(event.target)
            ) {
                setIsUserMenuOpen(false)
            }
        }

        if (isUserMenuOpen) {
            document.addEventListener("click", handleClickOutside)
        }

        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [isUserMenuOpen])

    // Fetch cart count
    const fetchCartCount = async (userId) => {
        try {
            const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart?userId=${userId}`)
            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu giỏ hàng")
            }
            const cartData = await response.json()
            const totalItems = cartData.length
            setCartCount(totalItems)
        } catch (error) {
            console.error("Lỗi khi lấy số lượng giỏ hàng:", error)
            setCartCount(0)
        }
    }

    // Fetch product suggestions
    const fetchSuggestions = useCallback(
        debounce(async (query) => {
            if (!query.trim()) {
                setSuggestions([])
                return
            }

            try {
                const response = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product")
                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu sản phẩm")
                }
                const products = await response.json()
                const filteredProducts = products
                    .filter((product) =>
                        product.productName.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 5) // Limit to 5 suggestions
                    .map((product) => ({
                        id: product.id,
                        name: product.productName,
                        image: product.imageUrl,
                    }))
                setSuggestions(filteredProducts)
            } catch (error) {
                console.error("Lỗi khi lấy gợi ý sản phẩm:", error)
                setSuggestions([])
            }
        }, 300),
        []
    )

    useEffect(() => {
        fetchSuggestions(searchText)
    }, [searchText, fetchSuggestions])

    const handleLogout = () => {
        clearUserFromLocalStorage()
        setUser(null)
        setIsLoggedIn(false)
        setCartCount(0)
        navigate("/login")
    }

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const toggleUserMenu = () => {
        setIsUserMenuOpen(!isUserMenuOpen)
    }

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchText.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchText)}`)
            setSearchText("")
            setSuggestions([])
        }
    }

    const handleSuggestionClick = (id) => {
        navigate(`/product/${id}`)
        setSearchText("")
        setSuggestions([])
    }

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            {/* Top bar */}
            <div className="bg-gray-900 py-2 px-4 flex justify-between items-center">
                <div className="font-medium text-white">Home Craft</div>
                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-white">
                        <span>0326-829-327</span>
                    </div>
                    <div className="flex items-center gap-1 text-white">
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
                        <ul className="absolute z-20 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion.id}
                                    onClick={() => handleSuggestionClick(suggestion.id)}
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                >
                                    {suggestion.image && (
                                        <img
                                            src={"/" + suggestion.image || "/placeholder.svg"}
                                            alt={suggestion.name}
                                            className="w-8 h-8 mr-2 rounded object-cover"
                                        />
                                    )}
                                    <span className="truncate">{suggestion.name}</span>
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
                    {!isLoggedIn && (
                        <Link to="/login" className="py-2 font-medium hover:text-blue-600">
                            Đăng nhập
                        </Link>
                    )}
                    {isLoggedIn && user && (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="py-2 font-medium hover:text-blue-600 focus:outline-none user-menu-button"
                            >
                                {user.username}
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20 user-menu">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
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
                        className="flex items-center px-4 py-2 border border-gray-300 text-gray-900 rounded-md hover:bg-gray-100 relative"
                    >
                        🛒
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                        <span className="ml-2">GIỎ HÀNG</span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden ml-4">
                    <button
                        className="p-2 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
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
                    {!isLoggedIn && (
                        <Link
                            to="/login"
                            className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100"
                        >
                            Đăng nhập
                        </Link>
                    )}
                    {isLoggedIn && user && (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="block w-full text-left px-4 py-2 text-gray-900 hover:bg-gray-100 focus:outline-none user-menu-button"
                            >
                                {user.username}
                            </button>
                            {isUserMenuOpen && (
                                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-xl z-20 user-menu">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100"
                                    >
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

export default Header