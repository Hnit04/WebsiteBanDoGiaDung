"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getUserFromLocalStorage } from "../assets/js/userData"
import { CheckCircle, AlertTriangle, X, Clock, Truck, Package, XCircle, Search } from "lucide-react"

const ProfilePage = () => {
    const [activeTab, setActiveTab] = useState("personal")
    const [user, setUser] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState({})
    const [products, setProducts] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState(null)
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [searchQuery, setSearchQuery] = useState("")

    // Hàm trạng thái
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "pending": return "bg-amber-100 text-amber-800 border border-amber-200"
            case "confirmed": return "bg-emerald-100 text-emerald-800 border border-emerald-200"
            case "shipping": return "bg-blue-100 text-blue-800 border border-blue-200"
            case "delivered": return "bg-green-100 text-green-800 border border-green-200"
            case "cancelled": return "bg-rose-100 text-rose-800 border border-rose-200"
            default: return "bg-gray-100 text-gray-800 border border-gray-200"
        }
    }

    const getStatusText = (status) => {
        switch (status) {
            case "pending": return "Chờ xác nhận"
            case "confirmed": return "Đã xác nhận"
            case "shipping": return "Đang giao hàng"
            case "delivered": return "Đã giao hàng"
            case "cancelled": return "Đã hủy"
            default: return "Không xác định"
        }
    }

    const getRole = (role) => {
        switch (role) {
            case "customer": return "Khách hàng"
            case "admin": return "Quản lý"
            default: return role
        }
    }

    const getStatusIcon = (status) => {
        switch (status) {
            case "pending": return <Clock className="h-4 w-4" />
            case "confirmed": return <CheckCircle className="h-4 w-4" />
            case "shipping": return <Truck className="h-4 w-4" />
            case "delivered": return <Package className="h-4 w-4" />
            case "cancelled": return <XCircle className="h-4 w-4" />
            default: return <AlertTriangle className="h-4 w-4" />
        }
    }

    // Lấy thông tin người dùng
    useEffect(() => {
        const loggedInUser = getUserFromLocalStorage()
        if (loggedInUser) {
            setUser(loggedInUser)
            setFullName(loggedInUser.fullName)
            setEmail(loggedInUser.email)
            fetchOrders(loggedInUser.id)
        } else {
            setError("Vui lòng đăng nhập để xem thông tin cá nhân")
            setIsLoading(false)
        }
    }, [])

    // Lấy lịch sử đơn hàng, chi tiết đơn hàng và danh sách sản phẩm
    const fetchOrders = async (userId) => {
        try {
            setIsLoading(true)

            // Lấy danh sách đơn hàng
            const orderResponse = await fetch(`https://67ffd634b72e9cfaf7260bc4.mockapi.io/order?userId=${userId}`)
            if (!orderResponse.ok) throw new Error("Không thể tải lịch sử đơn hàng")
            const ordersData = await orderResponse.json()
            setOrders(ordersData)

            // Lấy chi tiết đơn hàng
            const detailsResponse = await fetch(`https://67ffd634b72e9cfaf7260bc4.mockapi.io/orderDetail`)
            if (!detailsResponse.ok) throw new Error("Không thể tải chi tiết đơn hàng")
            const detailsData = await detailsResponse.json()

            const detailsByOrder = ordersData.reduce((acc, order) => {
                acc[order.id] = detailsData.filter(detail => detail.orderId === order.id)
                return acc
            }, {})
            setOrderDetails(detailsByOrder)

            // Lấy danh sách sản phẩm
            const productsResponse = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/product`)
            if (!productsResponse.ok) throw new Error("Không thể tải danh sách sản phẩm")
            const productsData = await productsResponse.json()
            // Chuyển danh sách sản phẩm thành object với key là productId
            const productsById = productsData.reduce((acc, product) => {
                acc[product.id] = product
                return acc
            }, {})
            setProducts(productsById)

        } catch (err) {
            console.error("Error fetching orders:", err)
            setError("Không thể tải dữ liệu. Vui lòng thử lại.")
        } finally {
            setIsLoading(false)
        }
    }

    // Hiển thị thông báo
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Cập nhật thông tin cá nhân (giả lập)
    const handleUpdatePersonalInfo = async (e) => {
        e.preventDefault()
        if (!fullName.trim() || !email.trim()) {
            showNotification("error", "Vui lòng điền đầy đủ thông tin")
            return
        }
        try {
            setIsSubmitting(true)
            setUser(prev => ({ ...prev, fullName, email }))
            showNotification("success", "Cập nhật thông tin cá nhân thành công")
        } catch (err) {
            console.error("Error updating personal info:", err)
            showNotification("error", "Không thể cập nhật thông tin. Vui lòng thử lại.")
        } finally {
            setIsSubmitting(false)
        }
    }

    // Đổi mật khẩu
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
            setUser(prev => ({ ...prev, password: newPassword }))
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

    // Lọc đơn hàng theo từ khóa tìm kiếm (bao gồm tên sản phẩm)
    const filteredOrders = orders.filter(order => {
        const matchesOrder = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.fullName.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesProduct = orderDetails[order.id]?.some(detail => {
            const product = products[detail.productId] || {}
            return product.productName?.toLowerCase().includes(searchQuery.toLowerCase())
        }) || false

        return matchesOrder || matchesProduct
    })

    // Hiển thị chi tiết đơn hàng
    const showOrderDetails = (order) => {
        const formatCurrency = (amount) => {
            return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
        }

        const formatDate = (dateString) => {
            const date = new Date(dateString)
            return date.toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
            })
        }

        const getPaymentMethodText = (methodId) => {
            switch (methodId) {
                case "PM001": return "Thẻ VISA/MasterCard"
                case "PM002": return "MoMo"
                case "PM003": return "Thanh toán khi nhận hàng (COD)"
                default: return "Không xác định"
            }
        }

        const printWindow = window.open("", "_blank", "width=800,height=600")

        const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hóa đơn #${order.id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .invoice-header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid #ddd;
          }
          .invoice-header h1 {
            color: #4338ca;
            margin-bottom: 5px;
          }
          .invoice-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
          }
          .invoice-info-block {
            max-width: 50%;
          }
          .invoice-info-block h4 {
            margin-bottom: 5px;
            color: #4338ca;
          }
          .invoice-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
          }
          .invoice-table th {
            background-color: #f3f4f6;
            text-align: left;
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .invoice-table td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
          }
          .invoice-table .amount {
            text-align: right;
          }
          .invoice-total {
            margin-top: 20px;
            text-align: right;
          }
          .invoice-total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
          }
          .invoice-total-row .label {
            width: 150px;
            text-align: left;
          }
          .invoice-total-row .value {
            width: 150px;
            text-align: right;
          }
          .invoice-total-row.final {
            font-weight: bold;
            font-size: 1.2em;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 10px;
            color: #4338ca;
          }
          .invoice-footer {
            margin-top: 50px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
          .close-btn {
            margin-top: 20px;
            text-align: center;
          }
          .close-btn button {
            padding: 10px 20px;
            background-color: #4338ca;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
          }
          .close-btn button:hover {
            background-color: #3730a3;
          }
          @media print {
            .close-btn {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>HÓA ĐƠN BÁN HÀNG</h1>
          <p>Ngày đặt hàng: ${formatDate(order.deliveryDate)}</p>
        </div>
        
        <div class="invoice-info">
          <div class="invoice-info-block">
            <h4>Thông tin khách hàng</h4>
            <p><strong>Khách hàng:</strong> ${user.fullName}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${order.deliveryAddress}</p>
          </div>
          <div class="invoice-info-block">
            <h4>Thông tin thanh toán</h4>
            <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(order.paymentMethodId)}</p>
            <p><strong>Trạng thái đơn hàng:</strong> ${getStatusText(order.status)}</p>
          </div>
        </div>
        
        <table class="invoice-table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Sản phẩm</th>
              <th>Đơn giá</th>
              <th>Số lượng</th>
              <th class="amount">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            ${orderDetails[order.id]
            .map(
                (detail, index) => {
                    const product = products[detail.productId] || {}
                    return `
              <tr>
                <td>${index + 1}</td>
                <td>${product.productName || "Sản phẩm không xác định"}</td>
                <td>${formatCurrency(detail.unitPrice)}</td>
                <td>${detail.quantity}</td>
                <td class="amount">${formatCurrency(detail.subtotal)}</td>
              </tr>
            `
                },
            )
            .join("")}
          </tbody>
        </table>
        
        <div class="invoice-total">
          <div class="invoice-total-row">
            <div class="label">Tổng tiền hàng:</div>
            <div class="value">${formatCurrency(order.totalAmount)}</div>
          </div>
          <div class="invoice-total-row">
            <div class="label">Phí vận chuyển:</div>
            <div class="value">${formatCurrency(0)}</div>
          </div>
          <div class="invoice-total-row final">
            <div class="label">Tổng thanh toán:</div>
            <div class="value">${formatCurrency(order.totalAmount)}</div>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p>Cảm ơn quý khách đã mua hàng tại cửa hàng chúng tôi!</p>
          <p>Mọi thắc mắc xin vui lòng liên hệ: tranngochung19112004@gmail.com | 0393465113</p>
        </div>
        
        <div class="close-btn">
          <button onclick="window.close()">Đóng</button>
        </div>
      </body>
      </html>
    `

        printWindow.document.open()
        printWindow.document.write(invoiceHtml)
        printWindow.document.close()
    }

    // Trạng thái không đăng nhập
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <AlertTriangle size={64} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Vui lòng đăng nhập</h1>
                        <p className="text-gray-600 mb-6">Bạn cần đăng nhập để xem thông tin cá nhân</p>
                        <Link
                            to="/login"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
                        >
                            Đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // Trạng thái đang tải
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Đang tải dữ liệu cá nhân...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        )
    }

    // Trạng thái lỗi
    if (error) {
        return (
            <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-lg rounded-xl p-8 text-center">
                        <div className="flex justify-center mb-6">
                            <AlertTriangle size={64} className="text-red-400"/>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Lỗi</h1>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            to="/"
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
                        >
                            Quay lại trang chủ
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            {notification && (
                <div
                    className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-xl max-w-md flex items-center justify-between ${
                        notification.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                    } animate-slide-in`}
                >
                    <div className="flex items-center">
                        {notification.type === "success" ? (
                            <CheckCircle size={20} className="text-green-600 mr-3" />
                        ) : (
                            <AlertTriangle size={20} className="text-red-600 mr-3" />
                        )}
                        <p>{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-600 hover:text-gray-800">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Tài khoản của bạn</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="lg:w-1/4">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            <nav className="space-y-2">
                                {["personal", "orders", "password"].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full text-left px-4 py-3 rounded-lg font-semibold transition-all ${
                                            activeTab === tab
                                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md"
                                                : "text-gray-700 hover:bg-gray-100"
                                        }`}
                                    >
                                        {tab === "personal" && "Thông tin cá nhân"}
                                        {tab === "orders" && "Lịch sử đơn hàng"}
                                        {tab === "password" && "Thay đổi mật khẩu"}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="lg:w-3/4">
                        <div className="bg-white shadow-lg rounded-xl p-6">
                            {activeTab === "personal" && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thông tin cá nhân</h2>
                                    <form onSubmit={handleUpdatePersonalInfo} className="space-y-4 max-w-md">
                                        <div>
                                            <label className="block font-semibold text-gray-700">Họ và tên</label>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="Họ và tên"
                                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Email"
                                                className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-300"
                                            />
                                        </div>
                                        <div>
                                            <label className="block font-semibold text-gray-700">Vai trò</label>
                                            <p className="mt-1 text-gray-600">{getRole(user.role)}</p>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                "Cập nhật thông tin"
                                            )}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
                                    <div className="mb-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="Tìm kiếm theo địa chỉ, tên sản phẩm..."
                                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                        </div>
                                    </div>
                                    {filteredOrders.length === 0 ? (
                                        <p className="text-gray-600">Không tìm thấy đơn hàng nào.</p>
                                    ) : (
                                        <div className="space-y-4 max-h-[750px] overflow-y-auto">
                                            {filteredOrders.map((order) => (
                                                <div key={order.id}
                                                     className="border border-gray-500 rounded-lg p-4 bg-white shadow-lg hover:shadow-md transition-all">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(order.status)}
                                                            <span
                                                                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                                {getStatusText(order.status)}
                            </span>
                                                        </div>
                                                        <button
                                                            onClick={() => showOrderDetails(order)}
                                                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                                                        >
                                                            Xem chi tiết
                                                        </button>
                                                    </div>
                                                    <div className="border-t border-gray-200 pt-4">
                                                        <p className="text-sm text-gray-600 mb-2">Địa chỉ
                                                            giao: {order.deliveryAddress}</p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            Tổng tiền: {new Intl.NumberFormat("vi-VN", {
                                                            style: "currency",
                                                            currency: "VND"
                                                        }).format(order.totalAmount)}
                                                        </p>
                                                        <div className="mt-4">
                                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Sản
                                                                phẩm:</h4>
                                                            {orderDetails[order.id]?.map((detail) => {
                                                                const product = products[detail.productId] || {}
                                                                return (
                                                                    <div key={detail.orderDetailId}
                                                                         className="flex items-center space-x-4 mb-2">
                                                                        <img
                                                                            src={product.imageUrl ? `/${product.imageUrl}` : "/placeholder.svg"}
                                                                            alt={product.productName || "Sản phẩm"}
                                                                            className="w-12 h-12 object-cover rounded"
                                                                        />
                                                                        <div>
                                                                            <p className="text-sm font-medium">{product.productName || "Sản phẩm không xác định"}</p>
                                                                            <p className="text-sm text-gray-600">
                                                                                Số
                                                                                lượng: {detail.quantity} x {new Intl.NumberFormat("vi-VN", {
                                                                                style: "currency",
                                                                                currency: "VND"
                                                                            }).format(detail.unitPrice)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === "password" && (
                                <div>
                                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Thay đổi mật khẩu</h2>
                                    <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
                                        <div>
                                            <label htmlFor="oldPassword" className="block font-semibold text-gray-700">
                                                Mật khẩu cũ
                                            </label>
                                            <input
                                                type="password"
                                                id="oldPassword"
                                                value={oldPassword}
                                                onChange={(e) => setOldPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="newPassword" className="block font-semibold text-gray-700">
                                                Mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                id="newPassword"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="confirmPassword"
                                                   className="block font-semibold text-gray-700">
                                                Xác nhận mật khẩu mới
                                            </label>
                                            <input
                                                type="password"
                                                id="confirmPassword"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
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

            {/* Thêm CSS cho hiệu ứng slide-in */}
            <style>{`
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slideIn 0.3s ease-out;
                }
            `}</style>
        </div>
    )
}

export default ProfilePage