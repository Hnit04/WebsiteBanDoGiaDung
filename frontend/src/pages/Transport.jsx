"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { users } from "../assets/js/userData"
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    Package,
    Truck,
    X,
    XCircle,
} from "lucide-react"

const Transport = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState(null)
    const [orders, setOrders] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const ordersPerPage = 5

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Get delivery status background color
    const getDeliveryStatusBgColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-amber-500"
            case "in_transit":
                return "bg-blue-500"
            case "delivered":
                return "bg-green-500"
            case "failed":
                return "bg-rose-500"
            default:
                return "bg-gray-500"
        }
    }

    // Get delivery status text
    const getDeliveryStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Chờ vận chuyển"
            case "in_transit":
                return "Đang vận chuyển"
            case "delivered":
                return "Đã giao"
            case "failed":
                return "Giao thất bại"
            default:
                return "Không xác định"
        }
    }

    // Get delivery status badge color
    const getDeliveryStatusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-800 border border-amber-200"
            case "in_transit":
                return "bg-blue-100 text-blue-800 border border-blue-200"
            case "delivered":
                return "bg-green-100 text-green-800 border border-green-200"
            case "failed":
                return "bg-rose-100 text-rose-800 border border-rose-200"
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200"
        }
    }

    // Get delivery status icon
    const getDeliveryStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />
            case "in_transit":
                return <Truck className="h-4 w-4" />
            case "delivered":
                return <Package className="h-4 w-4" />
            case "failed":
                return <XCircle className="h-4 w-4" />
            default:
                return <AlertTriangle className="h-4 w-4" />
        }
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) {
            return "Không xác định"
        }

        const date = new Date(dateString)

        if (isNaN(date.getTime())) {
            return "Không xác định"
        }

        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true)

                // Fetch orders
                const orderResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/order")
                if (!orderResponse.ok) throw new Error("Không thể tải đơn hàng")
                const orderData = await orderResponse.json()
                setOrders(orderData)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Không thể tải dữ liệu vận chuyển. Vui lòng thử lại.")
                showNotification("error", "Không thể tải dữ liệu vận chuyển")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
    }

    // Filter orders based on search query
    const filteredOrders = orders.filter((order) => {
        const user = users.find((u) => u.id === parseInt(order.userId))
        return (
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (user && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
        )
    })

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

    // If loading
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Đang tải dữ liệu...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        )
    }

    // If error
    if (error) {
        return (
            <div className="flex items-center justify-center">
                <div className="bg-red-50 text-red-800 p-4 rounded-md">
                    <p className="font-medium">Lỗi</p>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="mx-auto max-w-7xl p-4">
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
                        {notification.type === "success"
                            ? <CheckCircle size={20} className="text-green-500 mr-3" />
                    : <AlertTriangle size={20} className="text-red-500 mr-3" />
                    }
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

    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Quản lý vận chuyển</h1>
        <div className="relative">
            <input
                type="text"
                placeholder="Tìm kiếm đơn hàng..."
                value={searchQuery}
                onChange={handleSearch}
                className="rounded-md border border-gray-300 py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    </div>

{/* Orders Table */}
    <div className="rounded-lg border bg-white shadow-sm">
        <div className="border-b px-4 py-3 sm:px-6">
            <h2 className="text-lg font-semibold">Danh sách đơn hàng</h2>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Mã đơn hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Khách hàng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Địa chỉ giao
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Ngày giao
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Trạng thái
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                        Thao tác
                    </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {currentOrders.map((order) => {
                    const customer = users.find((u) => u.id === parseInt(order.userId))
                    return (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm font-medium text-gray-900">{order.id}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm text-gray-900">
                                    {customer ? customer.fullName : "Unknown User"}
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="text-sm text-gray-500">{order.deliveryAddress}</div>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4">
                                <div className="text-sm text-gray-500">{formatDate(order.deliveryDate)}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getDeliveryStatusBadgeColor(
                                                    order.deliveryStatus
                                                )}`}
                                            >
                                                {getDeliveryStatusIcon(order.deliveryStatus)}
                                                <span className="ml-1">{getDeliveryStatusText(order.deliveryStatus)}</span>
                                            </span>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                                    Chi tiết
                                </Link>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </table>
        </div>
        <div className="border-t px-4 py-3 sm:px-6">
            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Hiển thị <span className="font-medium">{currentOrders.length}</span> trong tổng số{" "}
                    <span className="font-medium">{filteredOrders.length}</span> đơn hàng
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Trước
                    </button>
                    <button
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Tiếp
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
)
}

export default Transport