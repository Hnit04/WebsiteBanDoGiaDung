"use client"

import { useState, useEffect } from "react"
import { Bar, Pie, Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js"
import { users } from "../assets/js/userData"
import { AlertTriangle, CheckCircle, X } from "lucide-react"

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const Statistical = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [notification, setNotification] = useState(null)
    const [orders, setOrders] = useState([])
    const [orderDetails, setOrderDetails] = useState([])
    const [products, setProducts] = useState([])

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
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

                // Fetch order details
                const orderDetailResponse = await fetch("https://67ffd634b72e9cfaf7260bc4.mockapi.io/orderDetail")
                if (!orderDetailResponse.ok) throw new Error("Không thể tải chi tiết đơn hàng")
                const orderDetailData = await orderDetailResponse.json()
                setOrderDetails(orderDetailData)

                // Fetch products
                const productResponse = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product")
                if (!productResponse.ok) throw new Error("Không thể tải sản phẩm")
                const productData = await productResponse.json()
                setProducts(productData)
            } catch (err) {
                console.error("Error fetching data:", err)
                setError("Không thể tải dữ liệu thống kê. Vui lòng thử lại.")
                showNotification("error", "Không thể tải dữ liệu thống kê")
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Calculate revenue by month
    const salesChartData = {
        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
        datasets: [
            {
                label: "Doanh thu (VND)",
                data: orders
                    .reduce((acc, order) => {
                        const month = new Date(order.deliveryDate).getMonth()
                        acc[month] = (acc[month] || 0) + order.totalAmount
                        return acc
                    }, Array(6).fill(0)),
                backgroundColor: "rgba(59, 130, 246, 0.5)",
                borderColor: "rgb(59, 130, 246)",
                borderWidth: 1,
            },
        ],
    }

    // Calculate order status distribution
    const orderStatusChartData = {
        labels: ["Chờ xác nhận", "Chờ lấy hàng", "Chờ giao hàng", "Đã giao", "Trả hàng", "Đã hủy"],
        datasets: [
            {
                data: orders.reduce(
                    (acc, order) => {
                        switch (order.status) {
                            case "pending":
                                acc[0]++
                                break
                            case "ready_to_pick":
                                acc[1]++
                                break
                            case "shipping":
                                acc[2]++
                                break
                            case "delivered":
                                acc[3]++
                                break
                            case "returned":
                                acc[4]++
                                break
                            case "cancelled":
                                acc[5]++
                                break
                            default:
                                break
                        }
                        return acc
                    },
                    [0, 0, 0, 0, 0, 0]
                ),
                backgroundColor: ["#F59E0B", "#3B82F6", "#06B6D4", "#10B981", "#F97316", "#EF4444"],
                borderColor: ["#D97706", "#2563EB", "#0891B2", "#059669", "#EA580C", "#DC2626"],
                borderWidth: 1,
            },
        ],
    }

    // Calculate top selling products
    const topSellingProducts = products
        .map((product) => {
            const totalSold = orderDetails
                .filter((detail) => detail.productId === product.id)
                .reduce((sum, detail) => sum + detail.quantity, 0)
            return {
                ...product,
                sold: totalSold,
            }
        })
        .sort((a, b) => b.sold - a.sold)
        .slice(0, 5)

    const topProductsChartData = {
        labels: topSellingProducts.map((product) => product.productName),
        datasets: [
            {
                label: "Số lượng bán",
                data: topSellingProducts.map((product) => product.sold),
                backgroundColor: "rgba(16, 185, 129, 0.5)",
                borderColor: "rgb(16, 185, 129)",
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

            <h1 className="text-2xl font-bold mb-6">Thống kê</h1>

            {/* Charts Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Revenue Chart */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Doanh thu theo tháng</h2>
                    <div className="h-64 w-full">
                        <Bar
                            data={salesChartData}
                            options={{
                                maintainAspectRatio: false,
                                scales: {
                                    y: {
                                        beginAtZero: true,
                                        ticks: {
                                            callback: (value) => formatCurrency(value),
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Order Status Chart */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-4">Phân bố trạng thái đơn hàng</h2>
                    <div className="h-64 w-full">
                        <Pie
                            data={orderStatusChartData}
                            options={{
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        position: "right",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Top Selling Products Chart */}
                <div className="rounded-lg border bg-white p-4 shadow-sm md:col-span-2">
                    <h2 className="text-lg font-semibold mb-4">Top 5 sản phẩm bán chạy</h2>
                    <div className="h-80 w-full">
                        <Bar
                            data={topProductsChartData}
                            options={{
                                maintainAspectRatio: false,
                                indexAxis: "y",
                                scales: {
                                    x: {
                                        beginAtZero: true,
                                        ticks: {
                                            stepSize: 1,
                                        },
                                    },
                                },
                                plugins: {
                                    legend: {
                                        display: false,
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Statistical