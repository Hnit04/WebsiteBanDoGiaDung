"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
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
} from "lucide-react"
import { getUserFromLocalStorage, clearUserFromLocalStorage } from "../assets/js/userData"

const HomePageAdmin = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [activeTab, setActiveTab] = useState("overview")
    const [user, setUser] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        // Lấy thông tin người dùng từ localStorage
        const loggedInUser = getUserFromLocalStorage()

        // Kiểm tra xem người dùng đã đăng nhập chưa và có phải admin không
        if (!loggedInUser || loggedInUser.role !== "admin") {
            // Nếu chưa đăng nhập hoặc không phải admin, chuyển hướng về trang đăng nhập
            navigate("/login")
        } else {
            // Lưu thông tin người dùng vào state
            setUser(loggedInUser)
        }
    }, [navigate])
    console.log(user)
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const handleLogout = () => {
        // Xóa thông tin đăng nhập
        clearUserFromLocalStorage()

        // Chuyển hướng về trang đăng nhập
        navigate("/login")
    }

    // Nếu chưa có thông tin người dùng, hiển thị loading
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        )
    }

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:relative lg:translate-x-0`}
            >
                <div className="flex h-full flex-col">
                    {/* Sidebar Header */}
                    <div className="flex h-16 items-center justify-between border-b px-4">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                                <Layers className="h-5 w-5" />
                            </div>
                            <span className="text-lg font-bold">ShopAdmin</span>
                        </div>
                        <button onClick={toggleSidebar} className="rounded-md p-1.5 hover:bg-gray-100 lg:hidden">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Sidebar Content */}
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

                    {/* Sidebar Footer */}
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
                                <button onClick={handleLogout} className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100">
                                    <LogOut className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header */}
                <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-6">
                    <div className="flex items-center gap-2">
                        <button onClick={toggleSidebar} className="rounded-md p-1.5 hover:bg-gray-100 lg:hidden">
                            <Menu className="h-5 w-5" />
                        </button>
                        <div className="relative hidden md:block">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                            <input
                                type="search"
                                placeholder="Tìm kiếm..."
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
                                    <span className="font-medium text-blue-600">{user.fullName}</span>
                                </div>
                                <span className="hidden md:block font-medium">{user.fullName}</span>
                                <ChevronDown className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <div className="mx-auto max-w-7xl">
                        {/* Page Header */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-2xl font-bold">Dashboard</h1>
                            <div className="flex items-center gap-2">
                                <button className="inline-flex items-center gap-1 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 border border-gray-300">
                                    <Download className="h-4 w-4" />
                                    <span>Xuất báo cáo</span>
                                </button>
                                <button className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700">
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
                                        <p className="text-3xl font-bold">2,651</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs font-medium text-green-600">
                                    <span>↑ 12.5%</span>
                                    <span className="ml-1 text-gray-500">so với tháng trước</span>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                                        <Users className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Khách hàng</p>
                                        <p className="text-3xl font-bold">1,245</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs font-medium text-green-600">
                                    <span>↑ 8.2%</span>
                                    <span className="ml-1 text-gray-500">so với tháng trước</span>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50 text-green-600">
                                        <DollarSign className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Doanh thu</p>
                                        <p className="text-3xl font-bold">125.4M</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs font-medium text-green-600">
                                    <span>↑ 15.3%</span>
                                    <span className="ml-1 text-gray-500">so với tháng trước</span>
                                </div>
                            </div>
                            <div className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow">
                                <div className="flex items-center gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                                        <CreditCard className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Giao dịch</p>
                                        <p className="text-3xl font-bold">3,327</p>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center text-xs font-medium text-red-600">
                                    <span>↓ 2.3%</span>
                                    <span className="ml-1 text-gray-500">so với tháng trước</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Section */}
                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {/* Sales Chart */}
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
                                    {/* Chart would go here - using a placeholder */}
                                    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                                        <BarChart3 className="h-10 w-10 text-gray-400" />
                                        <p className="mt-2 text-sm font-medium text-gray-500">Biểu đồ doanh số bán hàng</p>
                                    </div>
                                </div>
                            </div>

                            {/* Order Status Chart */}
                            <div className="rounded-lg border bg-white p-4 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-lg font-semibold">Trạng thái đơn hàng</h2>
                                    <button className="rounded-md text-sm text-gray-500 hover:text-gray-700">
                                        <ChevronDown className="h-5 w-5" />
                                    </button>
                                </div>
                                <div className="grid h-64 grid-cols-2 gap-4">
                                    {/* Pie Chart would go here - using a placeholder */}
                                    <div className="flex h-full w-full items-center justify-center rounded-md border-2 border-dashed border-gray-300 bg-gray-50 p-4">
                                        <PieChart className="h-10 w-10 text-gray-400" />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Hoàn thành</p>
                                                <p className="text-sm font-medium">65%</p>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-100">
                                                <div className="h-2 rounded-full bg-green-500" style={{ width: "65%" }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Đang xử lý</p>
                                                <p className="text-sm font-medium">25%</p>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-100">
                                                <div className="h-2 rounded-full bg-blue-500" style={{ width: "25%" }}></div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm font-medium">Đã hủy</p>
                                                <p className="text-sm font-medium">10%</p>
                                            </div>
                                            <div className="h-2 w-full rounded-full bg-gray-100">
                                                <div className="h-2 rounded-full bg-red-500" style={{ width: "10%" }}></div>
                                            </div>
                                        </div>
                                    </div>
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
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Mã đơn hàng
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Khách hàng
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Ngày đặt
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Tổng tiền
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Trạng thái
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                                            >
                                                Thao tác
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                        {[
                                            {
                                                id: "ORD-001",
                                                customer: "Nguyễn Văn A",
                                                date: "12/05/2023",
                                                total: "1,250,000₫",
                                                status: "Hoàn thành",
                                                statusColor: "bg-green-100 text-green-800",
                                            },
                                            {
                                                id: "ORD-002",
                                                customer: "Trần Thị B",
                                                date: "11/05/2023",
                                                total: "850,000₫",
                                                status: "Đang xử lý",
                                                statusColor: "bg-blue-100 text-blue-800",
                                            },
                                            {
                                                id: "ORD-003",
                                                customer: "Lê Văn C",
                                                date: "10/05/2023",
                                                total: "2,150,000₫",
                                                status: "Đang giao",
                                                statusColor: "bg-yellow-100 text-yellow-800",
                                            },
                                            {
                                                id: "ORD-004",
                                                customer: "Phạm Thị D",
                                                date: "09/05/2023",
                                                total: "750,000₫",
                                                status: "Đã hủy",
                                                statusColor: "bg-red-100 text-red-800",
                                            },
                                            {
                                                id: "ORD-005",
                                                customer: "Hoàng Văn E",
                                                date: "08/05/2023",
                                                total: "1,550,000₫",
                                                status: "Hoàn thành",
                                                statusColor: "bg-green-100 text-green-800",
                                            },
                                        ].map((order, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.id}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-900">{order.customer}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm text-gray-500">{order.date}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{order.total}</div>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4">
                            <span
                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${order.statusColor}`}
                            >
                              {order.status}
                            </span>
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <Link to={`/admin/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                                                        Chi tiết
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="border-t px-4 py-3 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Hiển thị <span className="font-medium">5</span> trong tổng số{" "}
                                            <span className="font-medium">42</span> đơn hàng
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Trước
                                            </button>
                                            <button className="rounded-md border border-gray-300 bg-white px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                                Tiếp
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity and Top Products */}
                        <div className="mt-6 grid gap-4 md:grid-cols-3">
                            {/* Recent Activity */}
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
                                            {
                                                icon: <CreditCard className="h-4 w-4" />,
                                                title: "Thanh toán thành công",
                                                description: "Đơn hàng #ORD-005",
                                                time: "2 giờ trước",
                                                color: "text-yellow-600 bg-yellow-100",
                                            },
                                            {
                                                icon: <Truck className="h-4 w-4" />,
                                                title: "Đơn hàng đã giao",
                                                description: "Đơn hàng #ORD-003",
                                                time: "3 giờ trước",
                                                color: "text-indigo-600 bg-indigo-100",
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

                            {/* Top Products */}
                            <div className="md:col-span-2">
                                <div className="rounded-lg border bg-white shadow-sm">
                                    <div className="border-b px-4 py-3">
                                        <h2 className="text-lg font-semibold">Sản phẩm bán chạy</h2>
                                    </div>
                                    <div className="divide-y">
                                        {[
                                            {
                                                name: "Điện thoại iPhone 14 Pro Max",
                                                category: "Điện thoại",
                                                price: "29,990,000₫",
                                                sold: 125,
                                                image: "/placeholder.svg?height=48&width=48",
                                            },
                                            {
                                                name: "Laptop MacBook Air M2",
                                                category: "Laptop",
                                                price: "25,990,000₫",
                                                sold: 98,
                                                image: "/placeholder.svg?height=48&width=48",
                                            },
                                            {
                                                name: "Tai nghe AirPods Pro 2",
                                                category: "Phụ kiện",
                                                price: "5,990,000₫",
                                                sold: 210,
                                                image: "/placeholder.svg?height=48&width=48",
                                            },
                                            {
                                                name: "iPad Air 5",
                                                category: "Máy tính bảng",
                                                price: "15,990,000₫",
                                                sold: 87,
                                                image: "/placeholder.svg?height=48&width=48",
                                            },
                                        ].map((product, index) => (
                                            <div key={index} className="flex items-center gap-4 px-4 py-3">
                                                <img
                                                    src={product.image || "/placeholder.svg"}
                                                    alt={product.name}
                                                    className="h-12 w-12 rounded-md object-cover border"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="truncate text-sm font-medium">{product.name}</p>
                                                    <p className="text-xs text-gray-500">{product.category}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-medium">{product.price}</p>
                                                    <p className="text-xs text-gray-500">{product.sold} đã bán</p>
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
        </div>
    )
}

export default HomePageAdmin
