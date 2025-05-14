"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { users } from "../assets/js/userData"
import { ChevronDown, CreditCard, DollarSign, Download, Layers, Package, Plus, ShoppingBag, ShoppingCart, Truck, Users, X, AlertTriangle, CheckCircle } from 'lucide-react'
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const HomePageAdmin = () => {
    const [activeTab, setActiveTab] = useState("overview")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState(null)
    const [orders, setOrders] = useState([])
    const [products, setProducts] = useState([])
    const [customers, setCustomers] = useState([])
    const [stats, setStats] = useState({ orders: 0, customers: 0, revenue: 0, transactions: 0 })
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
    const [newProduct, setNewProduct] = useState({ productName: "", salePrice: "", categoryId: "", imageUrl: "" })
    const ordersPerPage = 5

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
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

                // Fetch products (placeholder API)
                const productResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/products")
                const productData = productResponse.ok ? await productResponse.json() : [
                    // Fallback placeholder products
                    { id: "1", productName: "Điện thoại iPhone 14", salePrice: 29990000, categoryId: "Điện thoại", sold: 125, imageUrl: "/placeholder.svg" },
                    { id: "2", productName: "Laptop MacBook Air", salePrice: 25990000, categoryId: "Laptop", sold: 98, imageUrl: "/placeholder.svg" },
                    { id: "3", productName: "Tai nghe AirPods Pro", salePrice: 5990000, categoryId: "Phụ kiện", sold: 210, imageUrl: "/placeholder.svg" },
                    { id: "4", productName: "iPad Air 5", salePrice: 15990000, categoryId: "Máy tính bảng", sold: 87, imageUrl: "/placeholder.svg" },
                ]
                setProducts(productData)

                // Fetch customers (using users array)
                setCustomers(users.filter((u) => u.role !== "admin"))

                // Calculate stats
                const revenue = orderData.reduce((sum, order) => sum + order.totalAmount, 0)
                setStats({
                    orders: orderData.length,
                    customers: users.filter((u) => u.role !== "admin").length,
                    revenue,
                    transactions: orderData.length,
                })
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.")
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
    const filteredOrders = orders.filter(
        (order) => {
            const user = users.find(u => u.id === parseInt(order.userId));
            return (
                order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }
    );

    // Pagination
    const indexOfLastOrder = currentPage * ordersPerPage
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)
    const totalPages = Math.ceil(filteredOrders.length / ordersPerPage)

    // Export report as CSV
    const exportReport = () => {
        const csvContent = [
            ["Mã đơn hàng", "Khách hàng", "Ngày đặt", "Tổng tiền", "Trạng thái"],
            ...orders.map((order) => {
                const user = users.find((u) => u.id === parseInt(order.userId))
                return [
                    order.id,
                    user ? user.fullName : "Unknown User",
                    order.deliveryDate,
                    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(order.totalAmount),
                    order.status,
                ]
            }),
        ]
            .map((row) => row.join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = `orders_report_${new Date().toISOString().split("T")[0]}.csv`
        link.click()
    }

    // Handle add product
    const handleAddProduct = async (e) => {
        e.preventDefault()
        if (!newProduct.productName || !newProduct.salePrice || !newProduct.categoryId) {
            showNotification("error", "Vui lòng điền đầy đủ thông tin sản phẩm")
            return
        }

        try {
            const response = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...newProduct,
                    salePrice: parseFloat(newProduct.salePrice),
                    sold: 0,
                }),
            })
            if (!response.ok) throw new Error("Không thể thêm sản phẩm")
            const addedProduct = await response.json()
            setProducts([...products, addedProduct])
            setIsAddProductModalOpen(false)
            setNewProduct({ productName: "", salePrice: "", categoryId: "", imageUrl: "" })
            showNotification("success", "Thêm sản phẩm thành công")
        } catch (err) {
            console.error("Error adding product:", err)
            showNotification("error", "Không thể thêm sản phẩm. Vui lòng thử lại.")
        }
    }

    // Chart data
    const salesChartData = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5"],
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: orders
                    .reduce((acc, order) => {
                        const month = new Date(order.deliveryDate).getMonth()
                        acc[month] = (acc[month] || 0) + order.totalAmount
                        return acc
                    }, Array(5).fill(0))
                    .slice(0, 5),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
        ],
    }

    const orderStatusChartData = {
        labels: ["Hoàn thành", "Đang xử lý", "Đã hủy"],
        datasets: [
            {
                data: orders.reduce(
                    (acc, order) => {
                        if (order.status === "confirmed") acc[0]++
                        else if (order.status === "pending") acc[1]++
                        else acc[2]++
                        return acc
                    },
                    [0, 0, 0]
                ),
                backgroundColor: ["#10B981", "#3B82F6", "#EF4444"],
                borderColor: ["#059669", "#2563EB", "#DC2626"],
                borderWidth: 1,
            },
        ],
    }

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
        <div className="mx-auto max-w-7xl">
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
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-4 text-gray-500 hover:text-gray-700"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportReport}
                        className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300"
                    >
                        <Download className="h-4 w-4" />
                        <span>Xuất báo cáo</span>
                    </button>

                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                            <ShoppingCart className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Đơn hàng</p>
                            <p className="text-3xl font-bold">{stats.orders}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                            <p className="text-3xl font-bold">{stats.customers}</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                            <p className="text-3xl font-bold">
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(stats.revenue)}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                            <CreditCard className="h-6 w-6" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Giao dịch</p>
                            <p className="text-3xl font-bold">{stats.transactions}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Doanh số bán hàng</h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setActiveTab("overview")}
                                className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
                                    activeTab === "overview" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Tổng quan
                            </button>
                            <button
                                onClick={() => setActiveTab("monthly")}
                                className={`rounded-md px-2.5 py-1.5 text-sm font-medium ${
                                    activeTab === "monthly" ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100"
                                }`}
                            >
                                Theo tháng
                            </button>
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <Bar data={salesChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Trạng thái đơn hàng</h2>
                        <button className="rounded-md text-sm text-gray-500 hover:text-gray-700">
                            <ChevronDown className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="h-64 w-full">
                        <Pie data={orderStatusChartData} options={{ maintainAspectRatio: false }} />
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="mt-6">
                <div className="rounded-lg border bg-white shadow-sm">
                    <div className="border-b px-4 py-3 sm:px-6">
                        <h2 className="text-lg font-semibold">Đơn hàng gần đây</h2>
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
                                    Ngày đặt
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Tổng tiền
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
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm text-gray-500">{order.deliveryDate}</div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                    order.totalAmount
                                                )}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                                        order.status === "confirmed"
                                                            ? "bg-green-100 text-green-800"
                                                            : order.status === "pending"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : "bg-red-100 text-red-800"
                                                    }`}
                                                >
                                                    {order.status === "pending" ? "Mới" : order.status}
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

            {/* Recent Activity and Top Products */}
            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="md:col-span-1">
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-lg font-semibold">Hoạt động gần đây</h2>
                        </div>
                        <div className="divide-y">
                            {[
                                {
                                    icon: <Package className="h-4 w-4" />,
                                    title: "Sản phẩm mới được thêm",
                                    description: "Điện thoại Samsung Galaxy S23",
                                    time: "5 phút trước",
                                    color: "text-blue-600 bg-blue-100",
                                },
                                {
                                    icon: <ShoppingBag className="h-4 w-4" />,
                                    title: "Đơn hàng mới",
                                    description: "Từ khách hàng Nguyễn Văn A",
                                    time: "15 phút trước",
                                    color: "text-green-600 bg-green-100",
                                },
                                {
                                    icon: <Users className="h-4 w-4" />,
                                    title: "Khách hàng mới đăng ký",
                                    description: "Trần Thị B",
                                    time: "1 giờ trước",
                                    color: "text-purple-600 bg-purple-100",
                                },
                            ].map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 px-4 py-3">
                                    <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${activity.color}`}>
                                        {activity.icon}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{activity.title}</p>
                                        <p className="text-xs text-gray-500">{activity.description}</p>
                                        <p className="mt-1 text-xs text-gray-400">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t p-4">
                            <button className="w-full rounded-md bg-white px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-200">
                                Xem tất cả
                            </button>
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <div className="rounded-lg border bg-white shadow-sm">
                        <div className="border-b px-4 py-3">
                            <h2 className="text-lg font-semibold">Sản phẩm bán chạy</h2>
                        </div>
                        <div className="divide-y">
                            {products
                                .sort((a, b) => (b.sold || 0) - (a.sold || 0))
                                .slice(0, 4)
                                .map((product) => (
                                    <div key={product.id} className="flex items-center gap-4 px-4 py-3">
                                        <img
                                            src={product.imageUrl || "/placeholder.svg"}
                                            alt={product.productName}
                                            className="h-12 w-12 rounded-md object-cover border"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium">{product.productName}</p>
                                            <p className="text-xs text-gray-500">{product.categoryId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">
                                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                    product.salePrice
                                                )}
                                            </p>
                                            <p className="text-xs text-gray-500">{product.sold || 0} đã bán</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="border-t p-4">
                            <Link
                                to="/admin/products"
                                className="inline-block w-full rounded-md bg-white px-3 py-1.5 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-200"
                            >
                                Xem tất cả sản phẩm
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default HomePageAdmin
