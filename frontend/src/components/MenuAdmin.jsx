import { useState } from "react"
import { Link } from "react-router-dom"
import { BarChart3, Calendar, HelpCircle, Layers, LayoutDashboard, LogOut, Package, Settings, ShoppingBag, Truck, Users, X } from 'lucide-react'

const MenuAdmin = ({ user, isSidebarOpen, toggleSidebar, handleLogout }) => {
    const [activeLink, setActiveLink] = useState("/admin"); // State để theo dõi link active, mặc định là "/admin"

    return (
        <div
            className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } lg:relative lg:translate-x-0`}
        >
            <div className="flex h-full flex-col">
                {/* Logo and Close Button */}
                <div className="flex h-16 items-center justify-between border-b px-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                            <Layers className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">THTStore Admin</span>
                    </div>
                    <button
                        onClick={toggleSidebar}
                        className="rounded-md p-1.5 hover:bg-gray-100 lg:hidden"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation Menu */}
                <div className="flex-1 overflow-auto py-4">
                    <nav className="space-y-1 px-2">
                        <p className="px-3 text-xs font-semibold uppercase text-gray-500">Tổng quan</p>
                        <Link
                            to="/admin"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin")}
                        >
                            <LayoutDashboard className="h-5 w-5" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            to="/admin/analytics"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/analytics" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/analytics")}
                        >
                            <BarChart3 className="h-5 w-5" />
                            <span>Phân tích</span>
                        </Link>
                        <Link
                            to="/admin/calendar"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/calendar" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/calendar")}
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Lịch</span>
                        </Link>
                        <p className="mt-6 px-3 text-xs font-semibold uppercase text-gray-500">Quản lý</p>
                        <Link
                            to="/admin/products"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/products" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/products")}
                        >
                            <Package className="h-5 w-5" />
                            <span>Sản phẩm</span>
                        </Link>
                        <Link
                            to="/admin/orders"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/orders" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/orders")}
                        >
                            <ShoppingBag className="h-5 w-5" />
                            <span>Đơn hàng</span>
                        </Link>
                        <Link
                            to="/admin/customers"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/customers" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/customers")}
                        >
                            <Users className="h-5 w-5" />
                            <span>Khách hàng</span>
                        </Link>
                        <Link
                            to="/admin/inventory"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/inventory" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/inventory")}
                        >
                            <Layers className="h-5 w-5" />
                            <span>Kho hàng</span>
                        </Link>
                        <Link
                            to="/admin/shipping"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/shipping" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/shipping")}
                        >
                            <Truck className="h-5 w-5" />
                            <span>Vận chuyển</span>
                        </Link>
                        <p className="mt-6 px-3 text-xs font-semibold uppercase text-gray-500">Cài đặt</p>
                        <Link
                            to="/admin/settings"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/settings" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/settings")}
                        >
                            <Settings className="h-5 w-5" />
                            <span>Thiết lập</span>
                        </Link>
                        <Link
                            to="/admin/help"
                            className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${
                                activeLink === "/admin/help" ? "bg-blue-100 text-blue-600" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onClick={() => setActiveLink("/admin/help")}
                        >
                            <HelpCircle className="h-5 w-5" />
                            <span>Trợ giúp</span>
                        </Link>
                    </nav>
                </div>

                {/* User Info (Existing Footer) */}
                {user && (
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
                )}
            </div>
        </div>
    )
}

export default MenuAdmin