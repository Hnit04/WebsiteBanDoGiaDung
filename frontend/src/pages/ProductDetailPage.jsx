"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ChevronRight, Heart, Minus, Plus, Share2, ShoppingCart, Star, CheckCircle, AlertTriangle, X } from 'lucide-react'
import { getUserFromLocalStorage } from "../assets/js/userData"

// Import product data
import { products } from "../assets/js/productData.jsx"

const ProductDetailPage = () => {
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1)
    const [activeTab, setActiveTab] = useState("details")
    const [activeImage, setActiveImage] = useState(0)
    const [isAddingToCart, setIsAddingToCart] = useState(false)
    const [notification, setNotification] = useState(null)
    const navigate = useNavigate()

    // Lấy dữ liệu người dùng từ localStorage
    const user = getUserFromLocalStorage()
    const userId = user?.id != null && user.id.toString().trim() !== ''
        ? user.id.toString() // Chuyển id thành chuỗi, chấp nhận cả số và chuỗi
        : null // Đảm bảo userId là chuỗi hợp lệ hoặc null
    console.log(userId)
    // Kiểm tra userId để debug
    useEffect(() => {
        if (!userId) {
            console.log("Không tìm thấy userId. Người dùng chưa đăng nhập hoặc dữ liệu localStorage không hợp lệ.");
        } else {
            console.log("userId hiện tại:", userId);
        }
    }, [userId])

    // Tìm sản phẩm theo ID
    const product = products.find((item) => item.id === Number.parseInt(id))

    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const [isInCart, setIsInCart] = useState(false)
    const [cartItemId, setCartItemId] = useState(null)
    const [cartQuantity, setCartQuantity] = useState(0)

    // Lấy dữ liệu giỏ hàng để kiểm tra sản phẩm
    useEffect(() => {
        const checkCartStatus = async () => {
            if (!userId || !product) return

            try {
                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart?userId=${userId}`)

                if (!response.ok) {
                    throw new Error("Không thể lấy dữ liệu giỏ hàng")
                }

                const cartData = await response.json()
                const cartItem = cartData.find(item => item.productId === id)

                if (cartItem) {
                    setIsInCart(true)
                    setCartItemId(cartItem.id)
                    setCartQuantity(cartItem.quantity)
                } else {
                    setIsInCart(false)
                    setCartItemId(null)
                    setCartQuantity(0)
                }
            } catch (error) {
                console.error("Lỗi khi kiểm tra giỏ hàng:", error)
            }
        }

        checkCartStatus()
    }, [userId, id, product])

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh]">
                <h2 className="text-2xl font-bold text-gray-800">Sản phẩm không tồn tại</h2>
                <p className="mt-2 text-gray-600">Không tìm thấy sản phẩm với ID #{id}</p>
                <Link
                    to="/products"
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                    Quay lại danh sách sản phẩm
                </Link>
            </div>
        )
    }

    // Tìm sản phẩm tương tự (loại trừ sản phẩm hiện tại)
    const similarProducts = products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id)

    // Xử lý tăng giảm số lượng
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        if (quantity < product.quantityInStock) setQuantity(quantity + 1)
    }

    // Hiển thị thông báo
    const showNotification = (type, message) => {
        setNotification({ type, message })

        // Tự động ẩn sau 3 giây
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    // Xử lý thêm vào giỏ hàng
    // Trong hàm handleAddToCart
    const handleAddToCart = async () => {
        if (!userId) {
            navigate("/login")
            return
        }

        try {
            setIsAddingToCart(true)

            // Nếu sản phẩm đã có trong giỏ, cập nhật số lượng
            if (isInCart && cartItemId) {
                const newQuantity = cartQuantity + quantity

                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart/${cartItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quantity: newQuantity
                    }),
                })

                if (!response.ok) {
                    throw new Error("Không thể cập nhật giỏ hàng")
                }

                setCartQuantity(newQuantity)
                showNotification("success", `Đã cập nhật số lượng sản phẩm "${product.productName}" trong giỏ hàng!`)
            } else {
                // Lấy danh sách giỏ hàng hiện tại để tính ID mới
                const cartResponse = await fetch('https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart')
                if (!cartResponse.ok) {
                    throw new Error("Không thể lấy dữ liệu giỏ hàng")
                }
                const cartData = await cartResponse.json()
                const nextId = (cartData.length + 1).toString()

                // Tạo payload và in ra để kiểm tra
                const payload = {
                    id: nextId,
                    userId: userId,
                    productId: String(id),
                    quantity: quantity
                }
                console.log("Dữ liệu gửi đi:", payload)

                // Gửi yêu cầu POST
                const response = await fetch('https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                })

                if (!response.ok) {
                    throw new Error("Không thể thêm vào giỏ hàng")
                }

                // Lấy và in dữ liệu trả về từ API
                const responseData = await response.json()
                console.log("Dữ liệu trả về từ API:", responseData)

                setIsInCart(true)
                setCartItemId(responseData.id)
                setCartQuantity(quantity)
                showNotification("success", `Đã thêm ${quantity} sản phẩm "${product.productName}" vào giỏ hàng!`)
                window.dispatchEvent(new Event('cartUpdated'))
            }
        } catch (error) {
            console.error("Lỗi khi thêm vào giỏ hàng:", error)
            showNotification("error", "Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.")
        } finally {
            setIsAddingToCart(false)
        }
    }

    // Xử lý mua ngay
    const handleBuyNow = async () => {
        if (!userId) {
            // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
            navigate("/login")
            return
        }

        try {
            setIsAddingToCart(true)

            // Thêm vào giỏ hàng trước
            if (!isInCart) {
                const cartResponse = await fetch('https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart')
                if (!cartResponse.ok) {
                    throw new Error("Không thể lấy dữ liệu giỏ hàng")
                }
                const cartData = await cartResponse.json()
                const nextId = (cartData.length + 1).toString()

                const response = await fetch('https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        id: nextId,
                        userId: userId,
                        productId: String(id), // Đảm bảo productId là chuỗi
                        quantity: quantity
                    }),
                })

                if (!response.ok) {
                    throw new Error("Không thể thêm vào giỏ hàng")
                }
            } else if (cartItemId) {
                // Cập nhật số lượng nếu đã có trong giỏ
                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart/${cartItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        quantity: quantity
                    }),
                })

                if (!response.ok) {
                    throw new Error("Không thể cập nhật giỏ hàng")
                }
            }

            // Chuyển hướng đến trang giỏ hàng
            navigate("/cart")
        } catch (error) {
            console.error("Lỗi khi xử lý mua ngay:", error)
            showNotification("error", "Không thể xử lý yêu cầu. Vui lòng thử lại sau.")
        } finally {
            setIsAddingToCart(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Thông báo */}
            {notification && (
                <div
                    className={`fixed top-20 right-4 z-900 p-4 rounded-md shadow-lg max-w-md flex items-center justify-between ${
                        notification.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    <div className="flex items-center">
                        {notification.type === "success" ? (
                            <CheckCircle size={20} className="text-green-500 mr-3" />
                        ) : (
                            <AlertTriangle size={20} className="text-red-500 mr-3" />
                        )}
                        <p>{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Breadcrumb */}
            <nav className="flex items-center text-sm text-gray-500 mb-6">
                <Link to="/" className="hover:text-blue-600 transition-colors">
                    Trang chủ
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <Link to="/products" className="hover:text-blue-600 transition-colors">
                    Sản phẩm
                </Link>
                <ChevronRight className="h-4 w-4 mx-2" />
                <span className="text-gray-800 font-medium truncate">{product.productName}</span>
            </nav>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Phần hình ảnh sản phẩm */}
                <div className="space-y-4">
                    <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-100">
                        <img
                            src={"/"+product.imageUrl}
                            alt={product.productName}
                            className="w-full h-full object-cover"
                        />
                        {product.originalPrice > product.salePrice && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                                Giảm {Math.round(((product.originalPrice - product.salePrice) / product.originalPrice) * 100)}%
                            </div>
                        )}
                    </div>
                </div>

                {/* Phần thông tin sản phẩm */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">{product.productName}</h1>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-baseline space-x-3">
                            <span className="text-3xl font-bold text-blue-600">{product.salePrice.toLocaleString("vi-VN")}₫</span>
                            {product.originalPrice > product.salePrice && (
                                <span className="text-lg text-gray-500 line-through">
                                    {product.originalPrice.toLocaleString("vi-VN")}₫
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-green-600 font-medium">✓ Còn hàng: {product.quantityInStock} sản phẩm</p>

                        {/* Hiển thị nếu sản phẩm đã có trong giỏ */}
                        {isInCart && (
                            <p className="text-sm text-blue-600 font-medium mt-1">
                                ✓ Đã có {cartQuantity} sản phẩm trong giỏ hàng
                            </p>
                        )}
                    </div>

                    <div className="h-px w-full bg-gray-200"></div>

                    <div className="space-y-4">
                        <p className="text-gray-600">{product.description}</p>

                        <div className="flex flex-wrap gap-2">
                            {["Giao hàng nhanh", "Bảo hành 12 tháng", "Đổi trả trong 7 ngày"].map((feature, index) => (
                                <span key={index} className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-full">
                                    {feature}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="h-px w-full bg-gray-200"></div>

                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="w-24 text-gray-600">Số lượng:</span>
                            <div className="flex items-center">
                                <button
                                    onClick={decreaseQuantity}
                                    className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-l-md hover:bg-gray-100"
                                    disabled={isAddingToCart}
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <div className="h-9 px-3 flex items-center justify-center border-y border-gray-300 w-12 text-center">
                                    {quantity}
                                </div>
                                <button
                                    onClick={increaseQuantity}
                                    className="h-9 w-9 flex items-center justify-center border border-gray-300 rounded-r-md hover:bg-gray-100"
                                    disabled={isAddingToCart || quantity >= product.quantityInStock}
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || product.quantityInStock === 0}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                            >
                                {isAddingToCart ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        {isInCart ? "Cập nhật giỏ hàng" : "Thêm vào giỏ hàng"}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={isAddingToCart || product.quantityInStock === 0}
                                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white py-3 px-4 rounded-md font-medium transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
                            >
                                {isAddingToCart ? "Đang xử lý..." : "Mua ngay"}
                            </button>
                            <button className="w-12 flex-shrink-0 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <Heart className="h-5 w-5" />
                            </button>
                            <button className="w-12 flex-shrink-0 border border-gray-300 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors">
                                <Share2 className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Thông báo hết hàng */}
                        {product.quantityInStock === 0 && (
                            <div className="text-red-600 font-medium text-center">
                                Sản phẩm đã hết hàng
                            </div>
                        )}

                        {/* Nhắc nhở đăng nhập */}
                        {!userId && (
                            <div className="text-gray-600 text-sm text-center border border-gray-200 rounded-md p-3 bg-gray-50">
                                <p>Vui lòng <Link to="/login" className="text-blue-600 font-medium">đăng nhập</Link> để thêm sản phẩm vào giỏ hàng</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Sản phẩm tương tự */}
            <div className="space-y-6">
                <h2 className="text-2xl font-bold">Sản phẩm tương tự</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {similarProducts.length > 0 ? (
                        similarProducts.map((item) => (
                            <Link
                                to={`/product/${item.id}`}
                                key={item.id}
                                className="group border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-square relative overflow-hidden bg-gray-100">
                                    <img
                                        src={"/"+item.imageUrl}
                                        alt={item.productName}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-3">
                                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {item.productName}
                                    </h3>
                                    <div className="mt-2 font-semibold text-blue-600">{item.salePrice.toLocaleString("vi-VN")}₫</div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="col-span-full text-gray-500">Không có sản phẩm tương tự</p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductDetailPage

