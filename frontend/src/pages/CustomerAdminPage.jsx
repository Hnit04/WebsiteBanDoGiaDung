

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
import { users } from "../assets/js/userData"

// Modal Component for Editing User
function EditUserModal({ isOpen, onClose, user, onUpdateUser }) {
    const [formData, setFormData] = useState({
        id: "",
        username: "",
        email: "",
        fullName: "",
        role: "",
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        if (user) {
            setFormData({
                id: user.id || "",
                username: user.username || "",
                email: user.email || "",
                fullName: user.fullName || "",
                role: user.role || "",
            })
        }
    }, [user])
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
    useEffect(() => {
        try {
            setIsLoading(true)
            // Lọc chỉ lấy user có role là customer và sắp xếp từ dưới lên theo ID
            const filteredCustomers = users
                .filter((user) => user.role === "customer")
                .sort((a, b) => b.id - a.id) // Sắp xếp giảm dần theo ID
            setCustomers(filteredCustomers)
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu khách hàng:", err)
            setError("Không thể tải dữ liệu khách hàng. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    // Filter customers based on search query
    const filteredCustomers = customers.filter(
        (customer) =>
            customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.username.toLowerCase().includes(searchQuery.toLowerCase()),
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
                .map((c) => (c.id === updatedCustomer.id ? updatedCustomer : c))
                .sort((a, b) => b.id - a.id), // Đảm bảo sắp xếp lại sau khi cập nhật
        )
        showNotification("success", "Khách hàng đã được cập nhật thành công")
    }

    // Handle delete customer
    const handleDeleteCustomer = (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa khách hàng này?")) {
            try {
                setCustomers(customers.filter((c) => c.id !== id))
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
                    <h3 className="text-xl font-semibold mb-3">Đã xảy ra lỗi</h3>
                    <p className="mb-5 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-white border border-red-300 rounded-xl text-red-700 hover:bg-red-50 transition-all"
                    >
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
                                {/*<th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">ID</th>*/}
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Tên khách hàng</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold tracking-wider">Vai trò</th>
                                {/*<th className="px-6 py-4 text-right text-sm font-semibold tracking-wider">Thao tác</th>*/}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {currentCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-6 text-center text-gray-600 font-medium">
                                        Không tìm thấy khách hàng nào
                                    </td>
                                </tr>
                            ) : (
                                currentCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all">
                                        {/*<td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900">{customer.id}</td>*/}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold text-lg">
                                                    {customer.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{customer.fullName}</div>
                                                    <div className="text-xs text-gray-500">{customer.username}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-600">{customer.email}</td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="inline-flex rounded-full px-3 py-1 text-xs font-semibold bg-green-100 text-green-800">
                                                Khách hàng
                                            </span>
                                        </td>
                                        {/*<td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">*/}
                                        {/*    <div className="flex justify-end gap-3">*/}
                                        {/*        <button*/}
                                        {/*            onClick={() => handleEditCustomer(customer)}*/}
                                        {/*            className="p-2 rounded-full text-purple-500 hover:text-purple-600 hover:bg-purple-100 transition-all"*/}
                                        {/*            title="Chỉnh sửa khách hàng"*/}
                                        {/*        >*/}
                                        {/*            <Edit className="h-5 w-5" />*/}
                                        {/*        </button>*/}
                                        {/*        <button*/}
                                        {/*            onClick={() => handleDeleteCustomer(customer.id)}*/}
                                        {/*            className="p-2 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 transition-all"*/}
                                        {/*            title="Xóa khách hàng"*/}
                                        {/*        >*/}
                                        {/*            <Trash2 className="h-5 w-5" />*/}
                                        {/*        </button>*/}
                                        {/*    </div>*/}
                                        {/*</td>*/}
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
