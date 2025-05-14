"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserFromLocalStorage } from "../assets/js/userData"
import { CheckCircle, AlertTriangle, X } from "lucide-react"

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("personal")
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState(null)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Get user from local storage
    useEffect(() => {
        const loggedInUser = getUserFromLocalStorage()
        if (loggedInUser) {
            setUser(loggedInUser)
            fetchOrders(loggedInUser.id)
        } else {
            setError("Vui lòng đăng nhập để xem thông tin cá nhân")
            setIsLoading(false)
        }
    }, [])

    // Fetch order history
    const fetchOrders = async (userId) => {
        try {
            setIsLoading(true)
            const response = await fetch(`https://67ffd634b72e9cfaf7260bc4.mockapi.io/order?userId=${userId}`)
            if (!response.ok) {
                throw new Error("Không thể tải lịch sử đơn hàng")
            }
            const data = await response.json()
            setOrders(data)
        } catch (err) {
            console.error("Error fetching orders:", err)
            setError("Không thể tải lịch sử đơn hàng. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => {
            setNotification(null)
        }, 3000)
    }

    // Handle password change
    const handlePasswordChange = async (e) => {
        e.preventDefault()
        if (!oldPassword || !newPassword || !confirmPassword) {
            showNotification("error", "Vui lòng điền đầy đủ các trường")
            return
        }
        if (oldPassword !== user.password) {
            showNotification("error", "Mật khẩu cũ không đúng")
            return
        }
        if (newPassword !== confirmPassword) {
            showNotification("error", "Mật khẩu mới và xác nhận mật khẩu không khớp")
            return
        }
        if (newPassword.length < 6) {
            showNotification("error", "Mật khẩu mới phải có ít nhất 6 ký tự")
            return
        }

        try {
            setIsSubmitting(true)
            // Since user data is hardcoded, we simulate updating the user object
            // In a real app, this would be an API call to update the user
            setUser((prev) => ({ ...prev, password: newPassword }))
            showNotification("success", "Đổi mật khẩu thành công")
            setOldPassword("")
            setNewPassword("")
            setConfirmPassword("")
        } catch (err) {
            console.error("Error changing password:", err)
            showNotification("error", "Không thể đổi mật khẩu. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // If not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-md rounded-lg p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <AlertTriangle size={64} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h1>
                        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin cá nhân</p>
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Đăng nhập
                        </Link>
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

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
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">Tài khoản của bạn</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            <nav className="space-y-2">
                                <button
                                    onClick={() => setActiveTab("personal")}
                                    className={`w-full text-left px-4 py-2 rounded-md ${
                                        activeTab === "personal"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Thông tin cá nhân
                                </button>
                                <button
                                    onClick={() => setActiveTab("orders")}
                                    className={`w-full text-left px-4 py-2 rounded-md ${
                                        activeTab === "orders"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Lịch sử đơn hàng
                                </button>
                                <button
                                    onClick={() => setActiveTab("password")}
                                    className={`w-full text-left px-4 py-2 rounded-md ${
                                        activeTab === "password"
                                            ? "bg-blue-600 text-white"
                                            : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    Thay đổi mật khẩu
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white shadow-md rounded-lg p-6">
                            {activeTab === "personal" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block font-semibold text-gray-700">Họ và tên</label>
                                            <p className="mt-1 text-gray-600">{user.fullName}</p>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700">Tên đăng nhập</label>
                                            <p className="mt-1 text-gray-600">{user.username}</p>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700">Email</label>
                                            <p className="mt-1 text-gray-600">{user.email}</p>
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700">Vai trò</label>
                                            <p className="mt-1 text-gray-600">{user.role}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
                                    {orders.length === 0 ? (
                                        <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
                                    ) : (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Mã đơn hàng</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Ngày đặt</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Tổng tiền</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Trạng thái</th>
                                                    <th className="py-3 px-4 font-semibold text-gray-700">Địa chỉ giao</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {orders.map((order) => (
                                                    <tr key={order.id} className="border-b border-gray-200">
                                                        <td className="py-3 px-4">{order.id}</td>
                                                        <td className="py-3 px-4">{order.deliveryDate}</td>
                                                        <td className="py-3 px-4">
                                                            {new Intl.NumberFormat("vi-VN", {
                                                                style: "currency",
                                                                currency: "VND"
                                                            }).format(order.totalAmount)}
                                                        </td>
                                                        <td className="py-3 px-4">
                                                                <span
                                                                    className={`inline-block px-2 py-1 rounded text-xs ${
                                                                        order.status === "confirmed"
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-yellow-100 text-yellow-800"
                                                                    }`}
                                                                >
                                                                    {order.status}
                                                                </span>
                                                        </td>
                                                        <td className="py-3 px-4">{order.deliveryAddress}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "password" && (
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 mb-6">Thay đổi mật khẩu</h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                        <div>
                                            <label
                                                htmlFor="oldPassword"
                                                className="block font-semibold text-gray-700"
                                            >
                                                Mật khẩu cũ
                                            </label>
                                            <input
                                                type="password"
                                                id="oldPassword"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="newPassword"
                                                className="block font-semibold text-gray-700"
                                            >
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="confirmPassword"
                                                className="block font-semibold text-gray-700"
                                            >
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                "Đổi mật khẩu"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage