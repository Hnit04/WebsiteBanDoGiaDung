"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { users } from "../assets/js/userData"
import {
    BarChart3,
    Bell,
    Calendar,
    ChevronDown,
    CreditCard,
    DollarSign,
    Download,
    HelpCircle,
    Layers,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    PieChart,
    Plus,
    Search,
    Settings,
    ShoppingBag,
    ShoppingCart,
    Truck,
    Users,
    X,
    AlertTriangle,
    CheckCircle,
} from "lucide-react"
import { Bar, Pie } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const HomePageAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [user, setUser] = useState(null)
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
    const navigate = useNavigate()

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Validate admin user and fetch data
    useEffect(() => {
        // Find admin user from hardcoded users array
        const adminUser = users.find((u) => u.role === "admin")
        if (!adminUser) {
            setError("Không tìm thấy tài khoản admin. Vui lòng đăng nhập.")
            navigate("/login")
            return
        }
        setUser(adminUser)

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
    }, [navigate])

    // Toggle sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    // Handle logout
    const handleLogout = () => {
        navigate("/login")
    }

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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    // If error or no admin user
    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="bg-white shadow-md rounded-lg p-8 text-center max-w-md">
                    <div className="flex justify-center mb-6">
                        <AlertTriangle size={64} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h1>
                    <p className="text-gray-600 mb-6">{error || "Không tìm thấy tài khoản admin."}</p>
                    <Link
                        to="/login"
                        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
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

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:relative lg:translate-x-0`}
            >
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-between border-b px-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Layers className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold">ShopAdmin</span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="rounded-md p-1.5 hover:bg-gray-100 lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    <div className="flex-1 overflow-auto py-4">
                        <nav className="space-y-1 px-2">
                            <p className="px-3 text-xs font-semibold uppercase text-gray-500">Tổng quan</p>
                            <Link
                                to="/admin"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50"
                            >
                                <LayoutDashboard className="h-5 w-5" />
                                <span>Dashboard</span>
                            </Link>
                            <Link
                                to="/admin/analytics"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <BarChart3 className="h-5 w-5" />
                                <span>Phân tích</span>
                            </Link>
                            <Link
                                to="/admin/calendar"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Calendar className="h-5 w-5" />
                                <span>Lịch</span>
                            </Link>
                            <p className="mt-6 px-3 text-xs font-semibold uppercase text-gray-500">Quản lý</p>
                            <Link
                                to="/admin/products"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Package className="h-5 w-5" />
                                <span>Sản phẩm</span>
                            </Link>
                            <Link
                                to="/admin/orders"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <ShoppingBag className="h-5 w-5" />
                                <span>Đơn hàng</span>
                            </Link>
                            <Link
                                to="/admin/customers"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Users className="h-5 w-5" />
                                <span>Khách hàng</span>
                            </Link>
                            <Link
                                to="/admin/inventory"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Layers className="h-5 w-5" />
                                <span>Kho hàng</span>
                            </Link>
                            <Link
                                to="/admin/shipping"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Truck className="h-5 w-5" />
                                <span>Vận chuyển</span>
                            </Link>
                            <p className="mt-6 px-3 text-xs font-semibold uppercase text-gray-500">Cài đặt</p>
                            <Link
                                to="/admin/settings"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <Settings className="h-5 w-5" />
                                <span>Thiết lập</span>
                            </Link>
                            <Link
                                to="/admin/help"
                                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                            >
                                <HelpCircle className="h-5 w-5" />
                                <span>Trợ giúp</span>
                            </Link>
                        </nav>
                    </div>
                    <div className="border-t p-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="font-medium text-blue-600">{user.fullName.charAt(0)}</span>
                            </div>
                            <div>
                                <p className="text-sm font-medium">{user.fullName}</p>
                                <p className="text-xs text-gray-500">{user.role}</p>
                            </div>
                            <div className="ml-auto">
                                <button
                                    onClick={handleLogout}
                                    className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                                >
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleSidebar}
                            className="rounded-md p-1.5 hover:bg-gray-100 lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Tìm kiếm đơn hàng..."
                                value={searchQuery}
                                onChange={handleSearch}
                                className="rounded-md border border-gray-300 bg-white pl-8 pr-4 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                            <Bell className="h-5 w-5" />
                            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
                        </button>
                        <button className="relative rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                            <MessageSquare className="h-5 w-5" />
                            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-blue-500"></span>
                        </button>
                        <div className="relative">
                            <button className="flex items-center gap-2 rounded-full hover:bg-gray-100 p-1.5">
                                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="font-medium text-blue-600">{user.fullName.charAt(0)}</span>
                                </div>
                                <span className="hidden md:block font-medium">{user.fullName}</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl">
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
                                <button
                                    onClick={() => setIsAddProductModalOpen(true)}
                                    className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>Thêm sản phẩm</span>
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
                </main>
            </div>

            {/* Add Product Modal */}
            {isAddProductModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Thêm sản phẩm mới</h2>
                            <button
                                onClick={() => setIsAddProductModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddProduct} className="space-y-4">
                            <div>
                                <label htmlFor="productName" className="block text-sm font-medium text-gray-700">
                                    Tên sản phẩm
                                </label>
                                <input
                                    type="text"
                                    id="productName"
                                    value={newProduct.productName}
                                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="salePrice" className="block text-sm font-medium text-gray-700">
                                    Giá bán (VND)
                                </label>
                                <input
                                    type="number"
                                    id="salePrice"
                                    value={newProduct.salePrice}
                                    onChange={(e) => setNewProduct({ ...newProduct, salePrice: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                                    Danh mục
                                </label>
                                <input
                                    type="text"
                                    id="categoryId"
                                    value={newProduct.categoryId}
                                    onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                                    URL hình ảnh
                                </label>
                                <input
                                    type="text"
                                    id="imageUrl"
                                    value={newProduct.imageUrl}
                                    onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsAddProductModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700"
                                >
                                    Thêm sản phẩm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomePageAdmin