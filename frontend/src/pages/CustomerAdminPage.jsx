"use client"

import { useState, useEffect } from "react"
import {
    Search,
    User,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    X,
    CheckCircle,
    AlertTriangle,
    Check,
    Mail,
    Key,
    Users,
} from "lucide-react"
import api from "../services/api.js"

// Modal Component for Editing User
function EditUserModal({ isOpen, onClose, user, onUpdateUser }) {
    const [formData, setFormData] = useState({
        id: "",
        username: "",
        email: "",
        role: "",
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (user) {
            setFormData({
                id: user._id || "",
                username: user.username || "",
                email: user.email || "",
                role: user.role || "",
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccessMessage("")

        try {
            const response = await api.put(`/users/${formData.id}`, {
                username: formData.username,
                email: formData.email,
                role: formData.role,
            })
            onUpdateUser(response.data)
            setSuccessMessage("Cập nhật khách hàng thành công!")
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            console.error("Lỗi khi cập nhật khách hàng:", err)
            setError(err.response?.data?.message || "Không thể cập nhật khách hàng. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa khách hàng</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg flex items-center">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <p className="text-sm">{successMessage}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khách hàng
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                            Vai trò
                        </label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        >
                            <option value="CUSTOMER">Khách hàng</option>
                            <option value="ADMIN">Quản trị viên</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            ) : (
                                <Check className="h-5 w-5 mr-2" />
                            )}
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function CustomerPage() {
    const [customers, setCustomers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [notification, setNotification] = useState(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    const customersPerPage = 10

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            setIsLoading(true)
            setError(null)

            const response = await api.get("/users")
            const usersData = Array.isArray(response.data) ? response.data : []
            console.log("Users data:", usersData)

            // Lọc chỉ lấy user có role là CUSTOMER và sắp xếp từ dưới lên theo _id
            const filteredCustomers = usersData
                .filter((user) => user.role === "CUSTOMER")
                .sort((a, b) => b._id.localeCompare(a._id)) // Sắp xếp giảm dần theo _id
            setCustomers(filteredCustomers)
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu khách hàng:", err)
            setError(
                err.response?.data?.message ||
                "Không thể tải dữ liệu khách hàng. Vui lòng thử lại."
            )
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    // Filter customers based on search query
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Pagination
    const indexOfLastCustomer = currentPage * customersPerPage
    const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer)
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage)

    // Handle edit customer
    const handleEditCustomer = (customer) => {
        setSelectedCustomer(customer)
        setIsEditModalOpen(true)
    }

    // Handle customer updated
    const handleCustomerUpdated = (updatedCustomer) => {
        setCustomers(
            customers
                .map((c) => (c._id === updatedCustomer._id ? updatedCustomer : c))
                .sort((a, b) => b._id.localeCompare(a._id)), // Đảm bảo sắp xếp lại sau khi cập nhật
        )
        setIsEditModalOpen(false)
        showNotification("success", "Khách hàng đã được cập nhật thành công")
    }

    // Handle delete customer
    const handleDeleteCustomer = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            try {
                await api.delete(`/users/${id}`)
                setCustomers(customers.filter((c) => c._id !== id))
                showNotification("success", "Khách hàng đã được xóa")
            } catch (err) {
                console.error("Lỗi khi xóa khách hàng:", err)
                showNotification("error", "Không thể xóa khách hàng. Vui lòng thử lại.")
            }
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="flex flex-col items-center bg-white p-10 rounded-2xl shadow-2xl">
                    <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-purple-600"></div>
                    <p className="mt-6 text-xl font-semibold text-gray-800">Đang tải dữ liệu khách hàng...</p>
                    <p className="text-sm text-gray-600 mt-2">Vui lòng chờ trong giây lát</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-100 to-pink-100">
                <div className="bg-red-100 text-red-800 p-8 rounded-2xl shadow-lg max-w-md">
                    <div className="flex items-center mb-6">
                        <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
                        <h3 className="text-xl font-semibold">Đã xảy ra lỗi</h3>
                    </div>
                    <p className="mb-5 text-sm">{error}</p>
                    <button
                        onClick={fetchCustomers}
                        className="px-6 py-3 bg-white border border-red-300 rounded-xl text-red-700 hover:bg-red-50 transition-all flex items-center justify-center"
                    >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6 md:p-8 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-6 right-6 z-50 p-5 rounded-xl shadow-2xl max-w-sm flex items-center justify-between animate-slide-in ${
                        notification.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                    }`}
                >
                    <div className="flex items-center">
                        {notification.type === "success" ? (
                            <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                        ) : (
                            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                        )}
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-600 hover:text-gray-800">
                        <X size={20} />
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">
                    Quản lý khách hàng
                </h1>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm khách hàng..."
                            className="pl-10 w-full md:w-72 border border-gray-200 rounded-xl py-3 px-4 bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Tên khách hàng</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Vai trò</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold tracking-wider">Thao tác</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {currentCustomers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-6 text-center text-gray-600 font-medium">
                                    Không tìm thấy khách hàng nào
                                </td>
                            </tr>
                        ) : (
                            currentCustomers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                                                {customer.username.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="text-sm font-semibold text-gray-900">{customer.username}</div>
                                                <div className="text-xs text-gray-500">{customer.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-800">
                                                Khách hàng
                                            </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-3">
                                            <button
                                                onClick={() => handleEditCustomer(customer)}
                                                className="p-2 rounded-full text-purple-500 hover:text-purple-600 hover:bg-purple-100 transition-all"
                                                title="Chỉnh sửa khách hàng"
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteCustomer(customer._id)}
                                                className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 transition-all"
                                                title="Xóa khách hàng"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {filteredCustomers.length > customersPerPage && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <div className="text-sm text-gray-700 font-medium">
                            Hiển thị <span className="font-semibold">{indexOfFirstCustomer + 1}</span> đến{" "}
                            <span className="font-semibold">{Math.min(indexOfLastCustomer, filteredCustomers.length)}</span>{" "}
                            trong tổng số <span className="font-semibold">{filteredCustomers.length}</span> khách hàng
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-pink-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Customer Modal */}
            {isEditModalOpen && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    user={selectedCustomer}
                    onUpdateUser={handleCustomerUpdated}
                />
            )}
        </div>
    )
}