"use client"

import { useState, useEffect } from "react"
import {
    Search,
    Package,
    Truck,
    ShoppingBag,
    X,
    ChevronDown,
    ChevronUp,
    Download,
    RefreshCw,
    Filter,
    Calendar,
    MapPin,
    CreditCard,
    User,
    CheckCircle,
    Clock,
    AlertTriangle,
    XCircle,
    Printer,
    ArrowUpRight,
    ShoppingCart,
    DollarSign,
    Box,
    Zap,
} from "lucide-react"
import { users } from "@/assets/js/userData"

export default function OrdersAdminPage() {
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState([])
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [dateFilter, setDateFilter] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" })
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        confirmed: 0,
        delivered: 0,
        cancelled: 0,
        revenue: 0,
    })

    // Fetch orders, order details, and products
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)

                // Fetch orders
                const ordersResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/order")
                if (!ordersResponse.ok) throw new Error("Không thể tải dữ liệu đơn hàng")
                const ordersData = await ordersResponse.json()

                // Fetch order details
                const orderDetailsResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/orderDetail")
                if (!orderDetailsResponse.ok) throw new Error("Không thể tải dữ liệu chi tiết đơn hàng")
                const orderDetailsData = await orderDetailsResponse.json()

                // Fetch products directly from the provided API
                const productsResponse = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product")
                if (!productsResponse.ok) throw new Error("Không thể tải dữ liệu sản phẩm")
                const productsData = await productsResponse.json()

                setProducts(productsData)

                // Process and combine data
                const processedOrders = ordersData.map((order) => {
                    // Find user information
                    const user = users.find((u) => u.id === Number(order.userId)) || { fullName: "Không xác định", email: "N/A" }

                    // Find order details for this order
                    const details = orderDetailsData.filter((detail) => detail.orderId === order.id)

                    // Enrich details with product information
                    const enrichedDetails = details.map((detail) => {
                        const product = productsData.find((p) => p.id === detail.productId) || null
                        return {
                            ...detail,
                            productName: product ? product.productName : `Sản phẩm #${detail.productId}`,
                            productImage: product ? product.imageUrl : null,
                            productPrice: product ? product.salePrice : detail.unitPrice,
                        }
                    })

                    return {
                        ...order,
                        userFullName: user.fullName,
                        userEmail: user.email,
                        details: enrichedDetails,
                    }
                })

                // Calculate stats
                const statsData = {
                    total: ordersData.length,
                    pending: ordersData.filter((o) => o.status === "pending").length,
                    confirmed: ordersData.filter((o) => o.status === "confirmed").length,
                    delivered: ordersData.filter((o) => o.status === "delivered").length,
                    cancelled: ordersData.filter((o) => o.status === "cancelled").length,
                    revenue: ordersData.reduce((sum, order) => sum + Number(order.totalAmount), 0),
                }

                setOrders(processedOrders)
                setOrderDetails(orderDetailsData)
                setStats(statsData)

                // Select first order by default
                if (processedOrders.length > 0) {
                    setSelectedOrder(processedOrders[0])
                }
            } catch (err) {
                console.error("Lỗi khi tải dữ liệu:", err)
                setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Handle order selection
    const handleSelectOrder = (order) => {
        setSelectedOrder(order)
    }

    // Filter orders based on search query, date filter, and status filter
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.userFullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.deliveryAddress.toLowerCase().includes(searchQuery.toLowerCase())

        const matchesDate = dateFilter ? new Date(order.deliveryDate).toLocaleDateString().includes(dateFilter) : true

        const matchesStatus = statusFilter ? order.status === statusFilter : true

        return matchesSearch && matchesDate && matchesStatus
    })

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortConfig.key === "totalAmount") {
            return sortConfig.direction === "asc" ? a.totalAmount - b.totalAmount : b.totalAmount - a.totalAmount
        }

        if (sortConfig.key === "deliveryDate") {
            return sortConfig.direction === "asc"
                ? new Date(a.deliveryDate) - new Date(b.deliveryDate)
                : new Date(b.deliveryDate) - new Date(a.deliveryDate)
        }

        // Default sort by ID
        return sortConfig.direction === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
    })

    // Handle sort
    const handleSort = (key) => {
        setSortConfig((prevConfig) => ({
            key,
            direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
        }))
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
    }

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    // Get status badge color
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-amber-100 text-amber-800 border border-amber-200"
            case "confirmed":
                return "bg-emerald-100 text-emerald-800 border border-emerald-200"
            case "shipping":
                return "bg-blue-100 text-blue-800 border border-blue-200"
            case "delivered":
                return "bg-green-100 text-green-800 border border-green-200"
            case "cancelled":
                return "bg-rose-100 text-rose-800 border border-rose-200"
            default:
                return "bg-gray-100 text-gray-800 border border-gray-200"
        }
    }

    // Get status background color
    const getStatusBgColor = (status) => {
        switch (status) {
            case "pending":
                return "bg-amber-500"
            case "confirmed":
                return "bg-emerald-500"
            case "shipping":
                return "bg-blue-500"
            case "delivered":
                return "bg-green-500"
            case "cancelled":
                return "bg-rose-500"
            default:
                return "bg-gray-500"
        }
    }

    // Get status text
    const getStatusText = (status) => {
        switch (status) {
            case "pending":
                return "Chờ xác nhận"
            case "confirmed":
                return "Đã xác nhận"
            case "shipping":
                return "Đang giao hàng"
            case "delivered":
                return "Đã giao hàng"
            case "cancelled":
                return "Đã hủy"
            default:
                return "Không xác định"
        }
    }

    // Get status icon
    const getStatusIcon = (status) => {
        switch (status) {
            case "pending":
                return <Clock className="h-4 w-4" />
            case "confirmed":
                return <CheckCircle className="h-4 w-4" />
            case "shipping":
                return <Truck className="h-4 w-4" />
            case "delivered":
                return <Package className="h-4 w-4" />
            case "cancelled":
                return <XCircle className="h-4 w-4" />
            default:
                return <AlertTriangle className="h-4 w-4" />
        }
    }

    // Get payment method text
    const getPaymentMethodText = (methodId) => {
        switch (methodId) {
            case "PM001":
                return "Thanh toán khi nhận hàng (COD)"
            case "PM002":
                return "Chuyển khoản ngân hàng"
            case "PM003":
                return "Ví điện tử (MoMo, ZaloPay)"
            case "PM004":
                return "Thẻ tín dụng/ghi nợ"
            default:
                return "Không xác định"
        }
    }

    // Get payment method icon
    const getPaymentMethodIcon = (methodId) => {
        switch (methodId) {
            case "PM001":
                return <DollarSign className="h-4 w-4" />
            case "PM002":
                return <CreditCard className="h-4 w-4" />
            case "PM003":
                return <Zap className="h-4 w-4" />
            case "PM004":
                return <CreditCard className="h-4 w-4" />
            default:
                return <CreditCard className="h-4 w-4" />
        }
    }

    // Export orders to CSV
    const exportToCSV = () => {
        const headers = ["Mã đơn hàng", "Khách hàng", "Địa chỉ", "Tổng tiền", "Ngày giao", "Trạng thái"]

        const csvContent = [
            headers.join(","),
            ...filteredOrders.map((order) =>
                [
                    order.id,
                    order.userFullName,
                    `"${order.deliveryAddress.replace(/"/g, '""')}"`,
                    order.totalAmount,
                    order.deliveryDate,
                    getStatusText(order.status),
                ].join(","),
            ),
        ].join("\n")

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `don-hang-${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    // Handle print invoice
    const handlePrintInvoice = () => {
        if (!selectedOrder) return

        // Create a new window for printing
        const printWindow = window.open("", "_blank", "width=800,height=600")

        // Generate invoice HTML
        const invoiceHtml = `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hóa đơn #${selectedOrder.id}</title>
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
          @media print {
            body {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <h1>HÓA ĐƠN BÁN HÀNG</h1>
          <p>Mã đơn hàng: #${selectedOrder.id}</p>
          <p>Ngày đặt hàng: ${formatDate(selectedOrder.deliveryDate)}</p>
        </div>
        
        <div class="invoice-info">
          <div class="invoice-info-block">
            <h4>Thông tin khách hàng</h4>
            <p><strong>Khách hàng:</strong> ${selectedOrder.userFullName}</p>
            <p><strong>Email:</strong> ${selectedOrder.userEmail}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${selectedOrder.deliveryAddress}</p>
          </div>
          <div class="invoice-info-block">
            <h4>Thông tin thanh toán</h4>
            <p><strong>Phương thức thanh toán:</strong> ${getPaymentMethodText(selectedOrder.paymentMethodId)}</p>
            <p><strong>Trạng thái đơn hàng:</strong> ${getStatusText(selectedOrder.status)}</p>
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
            ${selectedOrder.details
            .map(
                (detail, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${detail.productName}</td>
                <td>${formatCurrency(detail.unitPrice)}</td>
                <td>${detail.quantity}</td>
                <td class="amount">${formatCurrency(detail.subtotal)}</td>
              </tr>
            `,
            )
            .join("")}
          </tbody>
        </table>
        
        <div class="invoice-total">
          <div class="invoice-total-row">
            <div class="label">Tổng tiền hàng:</div>
            <div class="value">${formatCurrency(selectedOrder.totalAmount)}</div>
          </div>
          <div class="invoice-total-row">
            <div class="label">Phí vận chuyển:</div>
            <div class="value">${formatCurrency(0)}</div>
          </div>
          <div class="invoice-total-row final">
            <div class="label">Tổng thanh toán:</div>
            <div class="value">${formatCurrency(selectedOrder.totalAmount)}</div>
          </div>
        </div>
        
        <div class="invoice-footer">
          <p>Cảm ơn quý khách đã mua hàng tại cửa hàng chúng tôi!</p>
          <p>Mọi thắc mắc xin vui lòng liên hệ: tranngochung19112004@gmail.com | 0393465113</p>
        </div>
        
        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="padding: 10px 20px; background-color: #4338ca; color: white; border: none; border-radius: 5px; cursor: pointer;">
            In hóa đơn
          </button>
        </div>
      </body>
      </html>
    `

        // Write to the new window and print
        printWindow.document.open()
        printWindow.document.write(invoiceHtml)
        printWindow.document.close()

        // Wait for content to load before printing
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus()
                printWindow.print()
            }, 1000)
        }
    }

    // Handle refresh data
    const handleRefresh = async () => {
        try {
            setLoading(true)

            // Fetch orders
            const ordersResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/order")
            if (!ordersResponse.ok) throw new Error("Không thể tải dữ liệu đơn hàng")
            const ordersData = await ordersResponse.json()

            // Fetch order details
            const orderDetailsResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/orderDetail")
            if (!orderDetailsResponse.ok) throw new Error("Không thể tải dữ liệu chi tiết đơn hàng")
            const orderDetailsData = await orderDetailsResponse.json()

            // Fetch products directly from the provided API
            const productsResponse = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product")
            if (!productsResponse.ok) throw new Error("Không thể tải dữ liệu sản phẩm")
            const productsData = await productsResponse.json()

            setProducts(productsData)

            // Process and combine data
            const processedOrders = ordersData.map((order) => {
                // Find user information
                const user = users.find((u) => u.id === Number(order.userId)) || { fullName: "Không xác định", email: "N/A" }

                // Find order details for this order
                const details = orderDetailsData.filter((detail) => detail.orderId === order.id)

                // Enrich details with product information
                const enrichedDetails = details.map((detail) => {
                    const product = productsData.find((p) => p.id === detail.productId) || null
                    return {
                        ...detail,
                        productName: product ? product.productName : `Sản phẩm #${detail.productId}`,
                        productImage: product ? product.imageUrl : null,
                        productPrice: product ? product.salePrice : detail.unitPrice,
                    }
                })

                return {
                    ...order,
                    userFullName: user.fullName,
                    userEmail: user.email,
                    details: enrichedDetails,
                }
            })

            // Calculate stats
            const statsData = {
                total: ordersData.length,
                pending: ordersData.filter((o) => o.status === "pending").length,
                confirmed: ordersData.filter((o) => o.status === "confirmed").length,
                delivered: ordersData.filter((o) => o.status === "delivered").length,
                cancelled: ordersData.filter((o) => o.status === "cancelled").length,
                revenue: ordersData.reduce((sum, order) => sum + Number(order.totalAmount), 0),
            }

            setOrders(processedOrders)
            setOrderDetails(orderDetailsData)
            setStats(statsData)

            // Maintain selected order if possible
            if (selectedOrder) {
                const updatedSelectedOrder = processedOrders.find((o) => o.id === selectedOrder.id)
                setSelectedOrder(updatedSelectedOrder || (processedOrders.length > 0 ? processedOrders[0] : null))
            } else if (processedOrders.length > 0) {
                setSelectedOrder(processedOrders[0])
            }

            setError(null)
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu:", err)
            setError(err.message || "Đã xảy ra lỗi khi tải dữ liệu")
        } finally {
            setLoading(false)
        }
    }

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Đang tải dữ liệu đơn hàng...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        )
    }

    if (error && orders.length === 0) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-red-50 to-orange-50">
                <div className="bg-white text-red-800 p-8 rounded-xl shadow-lg max-w-md">
                    <div className="flex items-center mb-6">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold ml-4">Đã xảy ra lỗi</h3>
                    </div>
                    <p className="mb-6 text-gray-700">{error}</p>
                    <button
                        onClick={handleRefresh}
                        className="w-full px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center font-medium"
                    >
                        <RefreshCw className="h-5 w-5 mr-2" />
                        Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Quản lý đơn hàng</h1>
                        <p className="text-gray-600">Quản lý và theo dõi tất cả đơn hàng của khách hàng</p>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                        <button
                            onClick={handleRefresh}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="animate-spin h-4 w-4 border-2 border-gray-500 border-t-transparent rounded-full"></div>
                            ) : (
                                <RefreshCw className="h-4 w-4" />
                            )}
                            <span>Làm mới</span>
                        </button>
                        <button
                            onClick={exportToCSV}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
                        >
                            <Download className="h-4 w-4" />
                            <span>Xuất CSV</span>
                        </button>
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 shadow-md transition-all"
                        >
                            <Filter className="h-4 w-4" />
                            <span>Bộ lọc</span>
                            {isFilterOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Tổng đơn hàng</p>
                                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                                </div>
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <ShoppingCart className="h-6 w-6 text-blue-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>12% so với tháng trước</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Đơn chờ xác nhận</p>
                                    <p className="text-2xl font-bold text-amber-600">{stats.pending}</p>
                                </div>
                                <div className="bg-amber-100 p-3 rounded-lg">
                                    <Clock className="h-6 w-6 text-amber-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-amber-600">
                                <span>Cần xử lý sớm</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Đã xác nhận</p>
                                    <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
                                </div>
                                <div className="bg-emerald-100 p-3 rounded-lg">
                                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-emerald-600">
                                <span>Đang chuẩn bị hàng</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Đã hủy</p>
                                    <p className="text-2xl font-bold text-rose-600">{stats.cancelled}</p>
                                </div>
                                <div className="bg-rose-100 p-3 rounded-lg">
                                    <XCircle className="h-6 w-6 text-rose-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-rose-600">
                                <span>Cần kiểm tra lý do</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                        <div className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Doanh thu</p>
                                    <p className="text-2xl font-bold text-indigo-600">{formatCurrency(stats.revenue)}</p>
                                </div>
                                <div className="bg-indigo-100 p-3 rounded-lg">
                                    <DollarSign className="h-6 w-6 text-indigo-600" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-center text-xs text-green-600">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                <span>8% so với tháng trước</span>
                            </div>
                        </div>
                    </div>
                </div>

                {isFilterOpen && (
                    <div className="bg-white p-6 rounded-xl shadow-md mb-6 grid grid-cols-1 md:grid-cols-3 gap-6 border border-indigo-100">
                        <div>
                            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                                Tìm kiếm
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="search"
                                    placeholder="Tìm theo mã đơn, tên khách hàng, địa chỉ..."
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                {searchQuery && (
                                    <button
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                        onClick={() => setSearchQuery("")}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                Ngày giao hàng
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="dateFilter"
                                    placeholder="Nhập ngày (DD/MM/YYYY)"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                    value={dateFilter}
                                    onChange={(e) => setDateFilter(e.target.value)}
                                />
                                <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                {dateFilter && (
                                    <button
                                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                        onClick={() => setDateFilter("")}
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div>
                            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-2">
                                Trạng thái
                            </label>
                            <select
                                id="statusFilter"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                            >
                                <option value="">Tất cả trạng thái</option>
                                <option value="pending">Chờ xác nhận</option>
                                <option value="confirmed">Đã xác nhận</option>
                                <option value="shipping">Đang giao hàng</option>
                                <option value="delivered">Đã giao hàng</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order List */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-xl font-semibold text-gray-800">Danh sách đơn hàng</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Hiển thị {filteredOrders.length} trong tổng số {orders.length} đơn hàng
                                </p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("id")}
                                        >
                                            <div className="flex items-center">
                                                Mã đơn hàng
                                                {sortConfig.key === "id" &&
                                                    (sortConfig.direction === "asc" ? (
                                                        <ChevronUp className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 ml-1" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Khách hàng
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("totalAmount")}
                                        >
                                            <div className="flex items-center">
                                                Tổng tiền
                                                {sortConfig.key === "totalAmount" &&
                                                    (sortConfig.direction === "asc" ? (
                                                        <ChevronUp className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 ml-1" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                            onClick={() => handleSort("deliveryDate")}
                                        >
                                            <div className="flex items-center">
                                                Ngày giao
                                                {sortConfig.key === "deliveryDate" &&
                                                    (sortConfig.direction === "asc" ? (
                                                        <ChevronUp className="h-4 w-4 ml-1" />
                                                    ) : (
                                                        <ChevronDown className="h-4 w-4 ml-1" />
                                                    ))}
                                            </div>
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Trạng thái
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedOrders.length > 0 ? (
                                        sortedOrders.map((order) => (
                                            <tr
                                                key={order.id}
                                                className={`hover:bg-indigo-50 cursor-pointer transition-colors ${
                                                    selectedOrder?.id === order.id ? "bg-indigo-50" : ""
                                                }`}
                                                onClick={() => handleSelectOrder(order)}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-indigo-600">#{order.id}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-indigo-600 font-medium text-lg">
                                  {order.userFullName.charAt(0)}
                                </span>
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-gray-900">{order.userFullName}</div>
                                                            <div className="text-xs text-gray-500">{order.userEmail}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{formatCurrency(order.totalAmount)}</div>
                                                    <div className="text-xs text-gray-500">{order.details?.length || 0} sản phẩm</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{formatDate(order.deliveryDate)}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                                    order.status,
                                )}`}
                            >
                              {getStatusIcon(order.status)}
                                <span className="ml-1">{getStatusText(order.status)}</span>
                            </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-sm text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <ShoppingBag className="h-10 w-10 text-gray-300 mb-2" />
                                                    <p className="font-medium text-gray-600 mb-1">Không tìm thấy đơn hàng nào</p>
                                                    <p className="text-gray-500">Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-md h-full border border-gray-100">
                            <div className="border-b px-6 py-4">
                                <h2 className="text-xl font-semibold text-gray-800">Chi tiết đơn hàng</h2>
                            </div>

                            <div className="p-6">
                                {selectedOrder ? (
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">Đơn hàng #{selectedOrder.id}</h3>
                                                <p className="text-sm text-gray-500">{formatDate(selectedOrder.deliveryDate)}</p>
                                            </div>
                                            <div
                                                className={`px-3 py-1.5 rounded-lg ${getStatusBgColor(selectedOrder.status)} text-white font-medium text-sm flex items-center`}
                                            >
                                                {getStatusIcon(selectedOrder.status)}
                                                <span className="ml-1.5">{getStatusText(selectedOrder.status)}</span>
                                            </div>
                                        </div>

                                        <div className="border-t border-b py-4 space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-lg">
                                                    <User className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Thông tin khách hàng</h4>
                                                    <p className="text-sm font-medium text-gray-900">{selectedOrder.userFullName}</p>
                                                    <p className="text-sm text-gray-500">{selectedOrder.userEmail}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-lg">
                                                    <MapPin className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Địa chỉ giao hàng</h4>
                                                    <p className="text-sm text-gray-900">{selectedOrder.deliveryAddress}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3">
                                                <div className="bg-indigo-100 p-2 rounded-lg">
                                                    {getPaymentMethodIcon(selectedOrder.paymentMethodId)}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium text-gray-700">Phương thức thanh toán</h4>
                                                    <p className="text-sm text-gray-900">{getPaymentMethodText(selectedOrder.paymentMethodId)}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                                <Box className="h-4 w-4 mr-1.5 text-indigo-600" />
                                                Chi tiết sản phẩm
                                            </h4>
                                            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                                                {selectedOrder.details && selectedOrder.details.length > 0 ? (
                                                    selectedOrder.details.map((detail) => (
                                                        <div
                                                            key={detail.orderDetailId}
                                                            className="flex items-center p-3 border border-gray-200 rounded-lg hover:border-indigo-200 transition-colors"
                                                        >
                                                            <div className="w-14 h-14 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0 overflow-hidden">
                                                                {detail.productImage ? (
                                                                    <img
                                                                        src={"/"+detail.productImage || "/placeholder.svg"}
                                                                        alt={detail.productName}
                                                                        className="w-full h-full object-cover"
                                                                        onError={(e) => {
                                                                            e.target.onerror = null
                                                                            e.target.src = "/placeholder.svg?height=56&width=56"
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <ShoppingBag className="h-6 w-6 text-gray-400" />
                                                                )}
                                                            </div>
                                                            <div className="ml-3 flex-grow">
                                                                <p className="text-sm font-medium text-gray-900">{detail.productName}</p>
                                                                <div className="flex justify-between items-center mt-1">
                                                                    <p className="text-xs text-gray-500">
                                                                        {formatCurrency(detail.unitPrice)} x {detail.quantity}
                                                                    </p>
                                                                    <p className="text-sm font-medium text-indigo-600">
                                                                        {formatCurrency(detail.subtotal)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                                                        <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                                                        <p className="text-sm text-gray-500">Không có thông tin chi tiết sản phẩm</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="border-t pt-4 bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-xl">
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Tổng tiền sản phẩm:</span>
                                                <span className="text-sm font-medium">{formatCurrency(selectedOrder.totalAmount)}</span>
                                            </div>
                                            <div className="flex justify-between mb-2">
                                                <span className="text-sm text-gray-600">Phí vận chuyển:</span>
                                                <span className="text-sm font-medium">{formatCurrency(0)}</span>
                                            </div>
                                            <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                                                <span>Tổng cộng:</span>
                                                <span className="text-indigo-600">{formatCurrency(selectedOrder.totalAmount)}</span>
                                            </div>

                                            <div className="flex justify-center pt-4 mt-4 border-t border-gray-200">
                                                <button
                                                    onClick={handlePrintInvoice}
                                                    className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all flex items-center justify-center"
                                                >
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    In hóa đơn
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                                        <div className="bg-indigo-100 p-4 rounded-full mb-4">
                                            <Package className="h-10 w-10 text-indigo-600" />
                                        </div>
                                        <p className="text-lg font-medium mb-1 text-gray-700">Không có đơn hàng được chọn</p>
                                        <p className="text-sm text-center text-gray-500">
                                            Vui lòng chọn một đơn hàng từ danh sách để xem chi tiết
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
