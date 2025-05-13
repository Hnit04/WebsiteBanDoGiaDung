"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserFromLocalStorage } from "../assets/js/userData"
import { products } from "../assets/js/productData.jsx"
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, RefreshCw, AlertTriangle, CheckCircle, X } from "lucide-react"

const CartPage = () => {
    const [cartItems, setCartItems] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [showConfirmDelete, setShowConfirmDelete] = useState(false)
    const [itemToDelete, setItemToDelete] = useState(null)
    const [notification, setNotification] = useState(null)

    const user = getUserFromLocalStorage()
    const userId = user?.id || null

    // Fetch cart items for the current user
    useEffect(() => {
        const fetchCartItems = async () => {
            if (!userId) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart?userId=${userId}`)

                if (!response.ok) {
                    throw new Error("Failed to fetch cart items")
                }

                const data = await response.json()
                setCartItems(data)
            } catch (err) {
                console.error("Error fetching cart:", err)
                setError("Không thể tải giỏ hàng. Vui lòng thử lại sau.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCartItems()
    }, [userId])
    // console.log(cartItems)
    // Update cart item quantity
    const updateQuantity = async (cartItemId, newQuantity) => {
        if (newQuantity < 1) return

        try {
            setIsUpdating(true)
            // console.log("hung"+cartItemId)
            const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart/${cartItemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            })

            if (!response.ok) {
                throw new Error("Failed to update cart")
            }

            // Update local state
            setCartItems((prevItems) =>
                prevItems.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item)),
            )

            // showNotification("success", "Số lượng đã được cập nhật")
        } catch (err) {
            console.error("Error updating cart:", err)
            showNotification("error", "Không thể cập nhật số lượng. Vui lòng thử lại.")
        } finally {
            setIsUpdating(false)
        }
    }

    // Show delete confirmation
    const confirmDelete = (item) => {
        setItemToDelete(item)
        setShowConfirmDelete(true)
    }

    // Cancel delete
    const cancelDelete = () => {
        setItemToDelete(null)
        setShowConfirmDelete(false)
    }

    // Remove item from cart
    const removeItem = async () => {
        if (!itemToDelete) return

        try {
            setIsUpdating(true)
            const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/cart/${itemToDelete.id}`, {
                method: "DELETE",
            })

            if (!response.ok) {
                throw new Error("Failed to remove item from cart")
            }

            // Get product details for notification
            const product = getProductDetails(itemToDelete.productId)

            // Update local state
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemToDelete.id))

            // Show success notification
            showNotification("success", `Đã xóa ${product.productName} khỏi giỏ hàng`)
        } catch (err) {
            console.error("Error removing item:", err)
            showNotification("error", "Không thể xóa sản phẩm. Vui lòng thử lại sau.")
        } finally {
            setIsUpdating(false)
            setShowConfirmDelete(false)
            setItemToDelete(null)
        }
    }

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })

        // Auto hide after 3 seconds
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    // Get product details by ID from the imported products data
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

    // Calculate total price
    const calculateTotal = () => {
        return cartItems.reduce((total, item) => {
            const product = getProductDetails(item.productId)
            return total + product.salePrice * item.quantity
        }, 0)
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem giỏ hàng của bạn</p>
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
                            <ShoppingBag size={64} className="text-gray-400"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
                        <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
                        <Link
                            to="/products"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <ArrowLeft size={18} className="mr-2"/>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Empty cart
    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <ShoppingBag size={64} className="text-gray-400"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Giỏ hàng của bạn đang trống</h1>
                        <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục</p>
                        <Link
                            to="/products"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors inline-flex items-center"
                        >
                            <ArrowLeft size={18} className="mr-2"/>
                            Tiếp tục mua sắm
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Notification */}
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

            {/* Delete confirmation modal */}
            {showConfirmDelete && itemToDelete && (
                <div className="fixed inset-0 bg-black/20  flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Xác nhận xóa sản phẩm</h3>
                        <p className="text-gray-600 mb-6">
                            Bạn có chắc chắn muốn xóa{" "}
                            <span className="font-medium">{getProductDetails(itemToDelete.id).productName}</span> khỏi giỏ
                            hàng?
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                disabled={isUpdating}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={removeItem}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                                disabled={isUpdating}
                            >
                                {isUpdating ? (
                                    <>
                                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 size={16} className="mr-2" />
                                        Xóa
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Giỏ hàng của bạn</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart items */}
                    <div className="lg:w-2/3">
                        <div className="bg-white shadow-md rounded-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200">
                                <h2 className="text-xl font-semibold text-gray-800">Sản phẩm ({cartItems.length})</h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {cartItems.map((item) => {
                                    const product = getProductDetails(item.productId)
                                    return (
                                        <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                                            {/* Product image */}
                                            <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                <img
                                                    src={product.imageUrl || "/placeholder.svg?height=96&width=96"}
                                                    alt={product.productName}
                                                    className="w-full h-full object-cover object-center"
                                                />
                                            </div>

                                            {/* Product details */}
                                            <div className="flex-1 sm:ml-6 mt-4 sm:mt-0">
                                                <div className="flex flex-col sm:flex-row sm:justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-medium text-gray-800">{product.productName}</h3>
                                                        <p className="mt-1 text-sm text-gray-500">{product.categoryId}</p>
                                                    </div>
                                                    <p className="text-lg font-medium text-gray-900 mt-2 sm:mt-0">
                                                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                            product.salePrice,
                                                        )}
                                                    </p>
                                                </div>

                                                {/* Quantity and actions */}
                                                <div className="flex items-center justify-between mt-4">
                                                    <div
                                                        className="flex items-center border border-gray-300 rounded-md">
                                                        <button
                                                            onClick={() => {
                                                                const newQuantity = item.quantity - 1;
                                                                if (newQuantity >= 1) {
                                                                    setCartItems(prev =>
                                                                        prev.map(cartItem =>
                                                                            cartItem.productId === item.productId
                                                                                ? {...cartItem, quantity: newQuantity}
                                                                                : cartItem
                                                                        )
                                                                    );
                                                                    updateQuantity(item.id, newQuantity);
                                                                }
                                                            }}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            aria-label="Giảm số lượng"
                                                        >
                                                            <Minus size={16}/>
                                                        </button>

                                                        <input
                                                            type="text"
                                                            value={item.quantity === 0 ? "" : item.quantity}
                                                            onChange={(e) => {
                                                                const val = e.target.value;

                                                                // Cho phép người dùng xóa hoàn toàn để nhập lại
                                                                if (val === "") {
                                                                    setCartItems(prev =>
                                                                        prev.map(cartItem =>
                                                                            cartItem.productId === item.productId
                                                                                ? {...cartItem, quantity: 0}
                                                                                : cartItem
                                                                        )
                                                                    );
                                                                    return;
                                                                }

                                                                const newQuantity = parseInt(val);
                                                                if (!isNaN(newQuantity) && newQuantity >= 1 && newQuantity <= product.quantityInStock) {
                                                                    setCartItems(prev =>
                                                                        prev.map(cartItem =>
                                                                            cartItem.productId === item.productId
                                                                                ? {...cartItem, quantity: newQuantity}
                                                                                : cartItem
                                                                        )
                                                                    );
                                                                    updateQuantity(item.id, newQuantity);
                                                                }
                                                            }}
                                                            className="w-16 text-center border-x border-gray-300 py-1 outline-none"
                                                        />

                                                        <button
                                                            onClick={() => {
                                                                const newQuantity = item.quantity + 1;
                                                                if (newQuantity <= product.quantityInStock) {
                                                                    setCartItems(prev =>
                                                                        prev.map(cartItem =>
                                                                            cartItem.productId === item.productId
                                                                                ? {...cartItem, quantity: newQuantity}
                                                                                : cartItem
                                                                        )
                                                                    );
                                                                    updateQuantity(item.id, newQuantity);
                                                                }
                                                            }}
                                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                                            aria-label="Tăng số lượng"
                                                        >
                                                            <Plus size={16}/>
                                                        </button>
                                                    </div>


                                                    <button
                                                        onClick={() => confirmDelete(item)}
                                                        disabled={isUpdating}
                                                        className="text-red-600 hover:text-red-800 flex items-center disabled:opacity-50"
                                                        aria-label="Xóa sản phẩm"
                                                    >
                                                        <Trash2 size={18} className="mr-1"/>
                                                        <span>Xóa</span>
                                                    </button>
                                                </div>

                                                {/* Stock information */}
                                                {product.quantityInStock > 0 && (
                                                    <p className="text-sm text-green-600 mt-2">
                                                        Còn {product.quantityInStock} sản phẩm trong kho
                                                    </p>
                                                )}
                                                {product.quantityInStock <= 0 &&
                                                    <p className="text-sm text-red-600 mt-2">Hết hàng</p>}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="p-6 border-t border-gray-200">
                                <Link to="/products" className="text-blue-600 hover:text-blue-800 flex items-center">
                                    <ArrowLeft size={18} className="mr-2"/>
                                    Tiếp tục mua sắm
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Order summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white shadow-md rounded-lg p-6 sticky top-24">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Tạm tính ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm)
                  </span>
                                    <span className="text-gray-800 font-medium">
                    {new Intl.NumberFormat("vi-VN", {style: "currency", currency: "VND"}).format(calculateTotal())}
                  </span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí vận chuyển</span>
                                    <span className="text-gray-800 font-medium">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(30000)}
                  </span>
                                </div>

                                <div className="border-t border-gray-200 pt-4 flex justify-between">
                                    <span className="text-lg font-semibold text-gray-800">Tổng cộng</span>
                                    <span className="text-lg font-bold text-blue-600">
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        calculateTotal() + 30000,
                    )}
                  </span>
                                </div>
                            </div>

                            <button className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors">
                                Tiến hành thanh toán
                            </button>

                            <div className="mt-6 text-sm text-gray-500">
                                <p className="mb-2">Chúng tôi chấp nhận:</p>
                                <div className="flex space-x-2">
                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">VISA</div>
                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">MC</div>
                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">MOMO</div>
                                    <div className="w-12 h-8 bg-gray-200 rounded flex items-center justify-center text-xs">COD</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CartPage
