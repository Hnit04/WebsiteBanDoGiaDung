"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { getUserFromLocalStorage } from "../assets/js/userData"
import { products } from "../assets/js/productData.jsx"
import { CheckCircle, AlertTriangle, X, ArrowLeft, ShoppingBag } from "lucide-react"

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [notification, setNotification] = useState(null)
    const [deliveryAddress, setDeliveryAddress] = useState("")
    const [paymentMethod, setPaymentMethod] = useState("")
    const [orderSuccess, setOrderSuccess] = useState(null)

    const user = getUserFromLocalStorage()
    const userId = user?.id || null
    const navigate = useNavigate()
    const location = useLocation()

    // Fetch cart items based on selected items from query params
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!userId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const params = new URLSearchParams(location.search)
                const itemIds = params.get("items")?.split(",") || []

                if (itemIds.length === 0) {
                    throw new Error("No items selected")
                }

                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart?userId=${userId}`)
                if (!response.ok) {
                    throw new Error("Failed to fetch cart items")
                }

                const data = await response.json()
                const selectedItems = data.filter(item => itemIds.includes(item.id))
                setCartItems(selectedItems)
            } catch (err) {
                console.error("Error fetching cart:", err)
                setError("Không thể tải thông tin thanh toán. Vui lòng thử lại.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCartItems()
    }, [userId, location.search])

    // Get product details by ID
    const getProductDetails = (productId) => {
        return (
            products.find((product) => product.id.toString() === productId) || {
                productName: "Sản phẩm không tồn tại",
                originalPrice: 0,
                salePrice: 0,
                imageUrl: "/placeholder.svg",
                categoryId: "",
            }
        )
    }

    // Calculate order summary
    const calculateSummary = () => {
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
        const subtotal = cartItems.reduce((total, item) => {
            const product = getProductDetails(item.productId)
            return total + product.salePrice * item.quantity
        }, 0)
        const shippingFee = 30000
        const total = subtotal + shippingFee
        return { totalItems, subtotal, shippingFee, total }
    }

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    // Generate sequential order ID
    const generateOrderId = async () => {
        try {
            const response = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/order")
            if (!response.ok) {
                throw new Error("Failed to fetch orders")
            }
            const orders = await response.json()
            const lastOrder = orders.length > 0 ? orders[orders.length - 1] : null
            const lastId = lastOrder ? parseInt(lastOrder.id.replace("ORD", "")) : 0
            const newId = lastId + 1
            return `${newId.toString().padStart(1, "0")}`
        } catch (err) {
            console.error("Error generating order ID:", err)
            return `ORD${Date.now()}` // Fallback to timestamp if API fails
        }
    }

    // Handle order submission
    const handleSubmitOrder = async () => {
        if (!deliveryAddress.trim()) {
            showNotification("error", "Vui lòng nhập địa chỉ giao hàng")
            return
        }
        if (!paymentMethod) {
            showNotification("error", "Vui lòng chọn phương thức thanh toán")
            return
        }

        try {
            setIsSubmitting(true)

            // Generate sequential order ID
            const orderId = await generateOrderId()

            // Create order
            const orderData = {
                id: orderId,
                userId,
                promotionId: null, // No promotion in this implementation
                totalAmount: calculateSummary().total,
                status: "confirmed",
                deliveryAddress,
                deliveryStatus: "pending",
                deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0], // 2 days from now
                paymentMethodId: paymentMethod
            }

            const orderResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            })

            if (!orderResponse.ok) {
                throw new Error("Failed to create order")
            }

            // Create order details
            for (const item of cartItems) {
                const product = getProductDetails(item.productId)
                const orderDetailData = {
                    orderDetailId: `OD${Date.now()}${item.id}`,
                    quantity: item.quantity,
                    unitPrice: product.salePrice,
                    subtotal: product.salePrice * item.quantity,
                    orderId,
                    productId: item.productId
                }

                const detailResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/orderDetail", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(orderDetailData)
                })

                if (!detailResponse.ok) {
                    throw new Error("Failed to create order detail")
                }

                // Remove item from cart
                await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart/${item.id}`, {
                    method: "DELETE"
                })
            }

            setOrderSuccess(orderId)
            showNotification("success", "Đặt hàng thành công!")
        } catch (err) {
            console.error("Error submitting order:", err)
            showNotification("error", "Không thể đặt hàng. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // If user is not logged in
    if (!userId) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <ShoppingBag size={64} className="text-gray-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h1>
                        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để tiến hành thanh toán</p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/login"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Đăng nhập
                            </Link>
                            <Link
                                to="/products"
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Tiếp tục mua sắm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <AlertTriangle size={64} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lỗi thanh toán</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/cart"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <ArrowLeft size={18} className="mr-2" />
                            Quay lại giỏ hàng
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Order success state
    if (orderSuccess) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <CheckCircle size={64} className="text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Đặt hàng thành công!</h1>
                        <p className="text-gray-600 mb-2">Mã đơn hàng: {orderSuccess}</p>
                        <p className="text-gray-600 mb-6">Cảm ơn bạn đã mua sắm với chúng tôi!</p>
                        <div className="flex justify-center gap-4">
                            <Link
                                to="/products"
                                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Tiếp tục mua sắm
                            </Link>
                            <Link
                                to="/orders"
                                className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Xem đơn hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const { totalItems, subtotal, shippingFee, total } = calculateSummary()

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {notification && (
                <div
                    className={`fixed top-20 right-4 z-50 p-4 rounded-md shadow-lg max-w-md flex items-center justify-between ${
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

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin giao hàng</h2>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                                        Địa chỉ giao hàng
                                    </label>
                                    <input
                                        type="text"
                                        id="deliveryAddress"
                                        value={deliveryAddress}
                                        onChange={(e) => setDeliveryAddress(e.target.value)}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                        placeholder="Ví dụ: 123 Lê Lợi, Quận 1, TP.HCM"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Phương thức thanh toán</h2>
                            <div className="space-y-4">
                                {[
                                    { id: "PM001", name: "Thẻ VISA/MasterCard" },
                                    { id: "PM002", name: "MoMo" },
                                    { id: "PM003", name: "Thanh toán khi nhận hàng (COD)" }
                                ].map((method) => (
                                    <div key={method.id} className="flex items-center">
                                        <input
                                            type="radio"
                                            id={method.id}
                                            name="paymentMethod"
                                            value={method.id}
                                            checked={paymentMethod === method.id}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                                        />
                                        <label htmlFor={method.id} className="ml-3 block text-sm text-gray-700">
                                            {method.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white shadow-md rounded-lg p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sản phẩm ({totalItems})</h2>
                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => {
                                    const product = getProductDetails(item.productId)
                                    return (
                                        <div key={item.id} className="py-4 flex items-center">
                                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                <img
                                                    src={product.imageUrl || "/placeholder.svg?height=64&width=64"}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="ml-4 flex-1">
                                                <h3 className="text-base font-medium text-gray-800">{product.productName}</h3>
                                                <p className="mt-1 text-sm text-gray-500">Số lượng: {item.quantity}</p>
                                                <p className="mt-1 text-sm font-medium text-gray-900">
                                                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                        product.salePrice * item.quantity
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tạm tính ({totalItems} sản phẩm)</span>
                                    <span className="text-gray-800 font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(subtotal)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span className="text-gray-800 font-medium">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(shippingFee)}
                                    </span>
                                </div>
                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <span className="text-lg font-semibold text-gray-800">Tổng cộng</span>
                                    <span className="text-lg font-bold text-blue-600">
                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(total)}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmitOrder}
                                disabled={isSubmitting}
                                className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Xác nhận đặt hàng"
                                )}
                            </button>
                            <div className="mt-4">
                                <Link
                                    to="/cart"
                                    className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
                                >
                                    <ArrowLeft size={16} className="mr-2" />
                                    Quay lại giỏ hàng
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutPage