"use client"

import { useState, useEffect, useRef } from "react"
import {
    Plus,
    Search,
    Edit,
    Trash2,
    Eye,
    EyeOff,
    ChevronLeft,
    ChevronRight,
    X,
    Upload,
    RefreshCw,
    Save,
    ImageIcon,
    Tag,
    DollarSign,
    Package,
    FileText,
    Layers,
    Check,
} from "lucide-react"

// Sample categories
const categories = [
    { id: "kitchen", name: "Nhà bếp" },
    { id: "bathroom", name: "Phòng tắm" },
    { id: "bedroom", name: "Phòng ngủ" },
    { id: "livingroom", name: "Phòng khách" },
    { id: "furniture", name: "Nội thất" },
    { id: "decoration", name: "Đồ trang trí" }
]

export default function ProductsAdminPage() {
    // State for products data
    const [products, setProducts] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    // State for search and pagination
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 10

    // State for add/edit product modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
    const [selectedProduct, setSelectedProduct] = useState(null)

    // State for notification
    const [notification, setNotification] = useState(null)

    // Show notification
    const showNotification = (type, message) => {
        setNotification({ type, message })
        setTimeout(() => setNotification(null), 3000)
    }

    // Fetch products from API
    const fetchProducts = async () => {
        try {
            setIsLoading(true)
            const response = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product")

            if (!response.ok) {
                throw new Error(`Lỗi API: ${response.status}`)
            }

            const data = await response.json()
            setProducts(data)
        } catch (err) {
            console.error("Lỗi khi tải dữ liệu:", err)
            setError(err instanceof Error ? err.message : "Không thể tải dữ liệu sản phẩm")
        } finally {
            setIsLoading(false)
        }
    }

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts()
    }, [])

    // Filter products based on search query
    const filteredProducts = products.filter(
        (product) =>
            product.productName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.categoryId?.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    // Pagination
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

    // Handle add new product
    const handleAddProduct = () => {
        setIsAddModalOpen(true)
    }

    // Handle edit product
    const handleEditProduct = (product) => {
        setSelectedProduct(product)
        setIsUpdateModalOpen(true)
    }

    // Handle product added
    const handleProductAdded = (newProduct) => {
        setProducts([...products, newProduct])
        showNotification("success", "Sản phẩm mới đã được thêm thành công")
    }

    // Handle product updated
    const handleProductUpdated = (updatedProduct) => {
        setProducts(products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)))
        showNotification("success", "Sản phẩm đã được cập nhật thành công")
    }

    // Handle delete product
    const handleDeleteProduct = async (id) => {
        if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
            try {
                const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/product/${id}`, {
                    method: "DELETE",
                })

                if (!response.ok) {
                    throw new Error("Không thể xóa sản phẩm")
                }

                setProducts(products.filter((p) => p.id !== id))
                showNotification("success", "Sản phẩm đã được xóa")
            } catch (err) {
                console.error("Lỗi khi xóa sản phẩm:", err)
                showNotification("error", err instanceof Error ? err.message : "Không thể xóa sản phẩm")
            }
        }
    }

    // Handle toggle product visibility
    const handleToggleVisibility = async (id, currentShow) => {
        try {
            const product = products.find((p) => p.id === id)

            if (!product) return

            const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/product/${product.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...product, show: !currentShow }),
            })

            if (!response.ok) {
                throw new Error("Không thể cập nhật trạng thái sản phẩm")
            }

            const updatedProduct = await response.json()
            setProducts(products.map((p) => (p.id === id ? updatedProduct : p)))

            showNotification("success", `Sản phẩm đã được ${!currentShow ? "hiển thị" : "ẩn"}`)
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err)
            showNotification("error", err instanceof Error ? err.message : "Không thể cập nhật trạng thái sản phẩm")
        }
    }

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
    }

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = categories.find((c) => c.id === categoryId)
        return category ? category.name : categoryId
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="flex flex-col items-center bg-white p-8 rounded-xl shadow-lg">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
                    <p className="mt-6 text-lg font-medium text-gray-700">Đang tải dữ liệu sản phẩm...</p>
                    <p className="text-sm text-gray-500 mt-2">Vui lòng đợi trong giây lát</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-md">
                    <h3 className="text-lg font-medium mb-2">Đã xảy ra lỗi</h3>
                    <p className="mb-4">{error}</p>
                    <button
                        onClick={fetchProducts}
                        className="px-4 py-2 bg-white border border-red-300 rounded-md text-red-700 hover:bg-red-50"
                    >
                    Thử lại
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Notification */}
            {notification && (
                <div
                    className={`fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-md flex items-center justify-between ${
                        notification.type === "success"
                            ? "bg-green-50 text-green-800 border border-green-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                >
                    <div className="flex items-center">
                        {notification.type === "success" ? (
                            <Check className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                            <X className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <p>{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-4 text-gray-500 hover:text-gray-700">
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="flex flex-col md:flex-row items-center justify-between mb-6">
                <h1 className="text-2xl font-bold mb-4 md:mb-0">Quản lý sản phẩm</h1>
                <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <input
                            type="search"
                            placeholder="Tìm kiếm sản phẩm..."
                            className="pl-8 w-full md:w-64 border border-gray-300 rounded-md py-2 px-3"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value)
                                setCurrentPage(1)
                            }}
                        />
                    </div>
                    <button
                        onClick={handleAddProduct}
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                    >
                        <Plus className="h-4 w-4" />
                        Thêm sản phẩm
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[80px]">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                                Sản phẩm
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                Danh mục
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                Giá gốc
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]">
                                Giá bán
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                Tồn kho
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[100px]">
                                Trạng thái
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Thao tác
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {currentProducts.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                                    Không tìm thấy sản phẩm nào
                                </td>
                            </tr>
                        ) : (
                            currentProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{product.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 border">
                                                <img
                                                    src={product.imageUrl ? "/" + product.imageUrl : "/placeholder.svg?height=40&width=40"}
                                                    alt={product.productName}
                                                    className="h-full w-full object-cover"
                                                    onError={(e) => {
                                                        e.target.src = "/placeholder.svg?height=40&width=40"
                                                    }}
                                                />
                                            </div>
                                            <div className="font-medium text-sm">{product.productName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getCategoryName(product.categoryId)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatCurrency(product.originalPrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                        {formatCurrency(product.salePrice)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantityInStock}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              product.show ? "bg-emerald-100 text-emerald-800" : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {product.show ? "Hiển thị" : "Ẩn"}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleToggleVisibility(product.id, product.show)}
                                                className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                                title={product.show ? "Ẩn sản phẩm" : "Hiển thị sản phẩm"}
                                            >
                                                {product.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="p-1 rounded-md text-blue-400 hover:text-blue-500 hover:bg-blue-50"
                                                title="Chỉnh sửa sản phẩm"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="p-1 rounded-md text-red-400 hover:text-red-500 hover:bg-red-50"
                                                title="Xóa sản phẩm"
                                            >
                                                <Trash2 className="h-4 w-4" />
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
                {filteredProducts.length > productsPerPage && (
                    <div className="flex items-center justify-between px-4 py-3 border-t">
                        <div className="text-sm text-gray-700">
                            Hiển thị <span className="font-medium">{indexOfFirstProduct + 1}</span> đến{" "}
                            <span className="font-medium">{Math.min(indexOfLastProduct, filteredProducts.length)}</span> trong tổng số{" "}
                            <span className="font-medium">{filteredProducts.length}</span> sản phẩm
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Product Modal */}
            {isAddModalOpen && (
                <AddProductModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onAddProduct={handleProductAdded}
                    categories={categories}
                />
            )}

            {/* Update Product Modal */}
            {isUpdateModalOpen && (
                <UpdateProductModal
                    isOpen={isUpdateModalOpen}
                    onClose={() => setIsUpdateModalOpen(false)}
                    product={selectedProduct}
                    onUpdateProduct={handleProductUpdated}
                    categories={categories}
                />
            )}
        </div>
    )
}

// Add Product Modal Component
function AddProductModal({ isOpen, onClose, onAddProduct, categories }) {
    const fileInputRef = useRef(null)

    const initialProduct = {
        productName: "",
        originalPrice: "",
        salePrice: "",
        imageUrl: "",
        images: [],
        description: "",
        categoryId: "",
        quantityInStock: 0,
        show: true,
    }

    const [product, setProduct] = useState(initialProduct)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imagePreviews, setImagePreviews] = useState([])
    const [currentStep, setCurrentStep] = useState(1)
    const [successMessage, setSuccessMessage] = useState("")

    const handleRefresh = () => {
        setProduct(initialProduct)
        setImagePreviews([])
        setError(null)
    }

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target

        if (type === "file" && files) {
            const fileList = Array.from(files)
            const newImageUrls = fileList.map((file) => `img/${file.name}`)
            setProduct((prev) => ({
                ...prev,
                imageUrl: prev.imageUrl || newImageUrls[0] || "",
                images: [...prev.images, ...newImageUrls.slice(1)],
            }))

            // Create image previews
            const newPreviews = fileList.map((file) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                return new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result)
                })
            })
            Promise.all(newPreviews).then((previews) => setImagePreviews((prev) => [...prev, ...previews]))
        } else {
            setProduct((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }))
        }
    }

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        setSuccessMessage("")

        try {
            // Validate required fields
            if (!product.productName || !product.salePrice || !product.categoryId) {
                setError("Vui lòng điền đầy đủ thông tin bắt buộc")
                setLoading(false)
                return
            }

            const productData = {
                productName: product.productName,
                description: product.description,
                originalPrice: product.originalPrice ? Number.parseInt(product.originalPrice, 10) : 0,
                salePrice: product.salePrice ? Number.parseInt(product.salePrice, 10) : 0,
                quantityInStock: product.quantityInStock ? Number.parseInt(product.quantityInStock, 10) : 0,
                categoryId: product.categoryId,
                imageUrl: product.imageUrl,
                show: product.show,
            }

            console.log("Saving product data:", productData)

            // Call API to create product
            const response = await fetch("https://67ff3fb458f18d7209f0785a.mockapi.io/test/product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData),
            })

            if (!response.ok) {
                throw new Error("Không thể thêm sản phẩm")
            }

            const newProduct = await response.json()

            // Show success message
            setSuccessMessage("Sản phẩm đã được thêm thành công!")

            // If we have a response, pass it to the callback
            if (newProduct) {
                onAddProduct(newProduct)
            }

            // Set a short timeout before closing to show the success message
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            console.error("Error saving product:", err)
            setError(err.message || "Đã có lỗi xảy ra khi thêm sản phẩm. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => {
        if (currentStep === 1 && (!product.productName || !product.salePrice || !product.categoryId)) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }
        setError(null)
        setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1)
        setError(null)
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    useEffect(() => {
        if (successMessage) {
            const timer = setTimeout(() => {
                onClose()
            }, 1500)
            return () => clearTimeout(timer)
        }
    }, [successMessage, onClose])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Thêm sản phẩm mới</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress indicator */}
                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                1
                            </div>
                            <div className={`h-1 w-12 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                2
                            </div>
                            <div className={`h-1 w-12 ${currentStep >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"}`}
                            >
                                3
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {currentStep === 1 ? "Thông tin cơ bản" : currentStep === 2 ? "Mô tả & Hình ảnh" : "Xác nhận"}
                        </div>
                    </div>
                </div>

                {/* Form content */}
                <div className="px-6 py-4">
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="productName" className="flex items-center text-sm font-medium text-gray-700">
                                        <Tag className="w-4 h-4 mr-2 text-blue-600" />
                                        Tên sản phẩm <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        id="productName"
                                        placeholder="Nhập tên sản phẩm"
                                        value={product.productName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="categoryId" className="flex items-center text-sm font-medium text-gray-700">
                                        <Layers className="w-4 h-4 mr-2 text-blue-600" />
                                        Danh mục <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        value={product.categoryId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="salePrice" className="flex items-center text-sm font-medium text-gray-700">
                                        <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                                        Giá bán <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="salePrice"
                                            id="salePrice"
                                            placeholder="Nhập giá bán"
                                            value={product.salePrice}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                            required
                                        />
                                        <span className="absolute left-3 top-2 text-gray-500">₫</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="originalPrice" className="flex items-center text-sm font-medium text-gray-700">
                                        <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                                        Giá gốc
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            id="originalPrice"
                                            placeholder="Nhập giá gốc"
                                            value={product.originalPrice}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        />
                                        <span className="absolute left-3 top-2 text-gray-500">₫</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="quantityInStock" className="flex items-center text-sm font-medium text-gray-700">
                                        <Package className="w-4 h-4 mr-2 text-blue-600" />
                                        Số lượng tồn <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantityInStock"
                                        id="quantityInStock"
                                        placeholder="Nhập số lượng tồn kho"
                                        value={product.quantityInStock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">Trạng thái</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="show"
                                            id="show"
                                            checked={product.show}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="show" className="text-sm text-gray-700">
                                            Hiển thị sản phẩm
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
                                    <FileText className="w-4 h-4 mr-2 text-blue-600" />
                                    Mô tả sản phẩm
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                                    value={product.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                    rows={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <ImageIcon className="w-4 h-4 mr-2 text-blue-600" />
                                    Hình ảnh sản phẩm <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${imagePreviews.length > 0 ? "border-blue-300" : "border-gray-300"}`}
                                    onClick={triggerFileInput}
                                >
                                    <input
                                        type="file"
                                        name="images"
                                        id="images"
                                        ref={fileInputRef}
                                        onChange={handleChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />

                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview || "/placeholder.svg"}
                                                        alt={`Preview ${index + 1}`}
                                                        className="max-h-32 mx-auto object-contain"
                                                    />
                                                    {index === 0 && (
                                                        <span className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                              Ảnh chính
                            </span>
                                                    )}
                                                </div>
                                            ))}
                                            <p className="text-sm text-center text-gray-500">Nhấp để thêm hoặc thay đổi hình ảnh</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <Upload className="w-12 h-12 mx-auto text-blue-500" />
                                            <p className="text-gray-700 font-medium">Kéo thả hoặc nhấp để tải lên</p>
                                            <p className="text-sm text-gray-500">PNG, JPG, GIF (tối đa 5MB, nhiều ảnh)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Xác nhận thông tin sản phẩm</h3>

                            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Tên sản phẩm</p>
                                    <p className="font-medium">{product.productName || "Chưa có thông tin"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Danh mục</p>
                                    <p className="font-medium">
                                        {categories.find((c) => c.id === product.categoryId)?.name || "Chưa chọn danh mục"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Giá bán</p>
                                    <p className="font-medium text-blue-600">
                                        {product.salePrice
                                            ? `${Number.parseInt(product.salePrice).toLocaleString("vi-VN")}₫`
                                            : "Chưa có thông tin"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Số lượng tồn</p>
                                    <p className="font-medium">{product.quantityInStock || "0"}</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm text-gray-500">Mô tả</p>
                                    <p className="font-medium">{product.description || "Không có mô tả"}</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm text-gray-500">Hình ảnh</p>
                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {imagePreviews.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-32 object-contain"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-red-500">Chưa có hình ảnh</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-2" />
                            <p className="text-green-600 text-sm">{successMessage}</p>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex justify-between items-center">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Quay lại
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={handleRefresh}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Làm mới
                            </button>

                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Tiếp theo
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Lưu sản phẩm
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Update Product Modal Component
function UpdateProductModal({ isOpen, onClose, product, onUpdateProduct, categories }) {
    const fileInputRef = useRef(null)

    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [imageFiles, setImageFiles] = useState([])
    const [imagePreviews, setImagePreviews] = useState([])
    const [currentStep, setCurrentStep] = useState(1)
    const [successMessage, setSuccessMessage] = useState("")

    const [formData, setFormData] = useState({
        id: "",
        productName: "",
        originalPrice: "",
        salePrice: "",
        description: "",
        imageUrl: "",
        images: [],
        categoryId: "",
        quantityInStock: "",
        show: true,
    })

    useEffect(() => {
        if (product) {
            setFormData({
                id: product.id || "",
                productName: product.productName || "",
                originalPrice: product.originalPrice || 0,
                salePrice: product.salePrice || 0,
                description: product.description || "",
                imageUrl: product.imageUrl || "",
                images: product.images || [],
                categoryId: product.categoryId || "",
                quantityInStock: product.quantityInStock || 0,
                show: product.show !== undefined ? product.show : true,
            })

            // Set image previews if there are images
            if (product.imageUrl) {
                setImagePreviews([`/${product.imageUrl}`])
            }
        }
    }, [product])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))
    }

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        if (files.length > 0) {
            const newImageUrls = files.map((file) => `img/${file.name}`)
            setImageFiles((prev) => [...prev, ...files])
            setFormData((prev) => ({
                ...prev,
                imageUrl: prev.imageUrl || newImageUrls[0] || "",
                images: [...prev.images, ...newImageUrls.slice(1)],
            }))

            const newPreviews = files.map((file) => {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                return new Promise((resolve) => {
                    reader.onloadend = () => resolve(reader.result)
                })
            })
            Promise.all(newPreviews).then((previews) => setImagePreviews((prev) => [...prev, ...previews]))
        }
    }

    const handleSubmit = async () => {
        setError(null)
        setLoading(true)
        setSuccessMessage("")

        try {
            if (!formData.productName || !formData.salePrice || !formData.categoryId || !formData.quantityInStock) {
                setError("Vui lòng điền đầy đủ thông tin bắt buộc")
                setLoading(false)
                return
            }

            const updatedData = {
                id: formData.id,
                productName: formData.productName,
                originalPrice: Number.parseInt(formData.originalPrice?.toString() || "0", 10),
                salePrice: Number.parseInt(formData.salePrice?.toString() || "0", 10),
                description: formData.description,
                imageUrl: formData.imageUrl,
                categoryId: formData.categoryId,
                quantityInStock: Number.parseInt(formData.quantityInStock?.toString() || "0", 10),
                show: formData.show,
            }

            console.log("Updating product with data:", updatedData)

            const response = await fetch(`https://67ff3fb458f18d7209f0785a.mockapi.io/test/product/${formData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedData),
            })

            if (!response.ok) {
                throw new Error("Không thể cập nhật sản phẩm")
            }

            const updatedProduct = await response.json()

            // Hiển thị thông báo thành công
            setSuccessMessage("Sản phẩm đã được cập nhật thành công!")

            // Pass updated product to parent component
            if (updatedProduct) {
                onUpdateProduct(updatedProduct)
            }

            // Đợi một chút để người dùng thấy thông báo thành công
            setTimeout(() => {
                onClose()
            }, 1500)
        } catch (err) {
            console.error("Error updating product:", err)
            setError(err.message || "Đã có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const nextStep = () => {
        if (
            currentStep === 1 &&
            (!formData.productName || !formData.salePrice || !formData.categoryId || !formData.quantityInStock)
        ) {
            setError("Vui lòng điền đầy đủ thông tin bắt buộc")
            return
        }
        setError(null)
        setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        setCurrentStep(currentStep - 1)
        setError(null)
    }

    const triggerFileInput = () => {
        fileInputRef.current.click()
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden transform transition-all">
                <div className="bg-gradient-to-r from-purple-600 to-indigo-800 text-white px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Cập nhật sản phẩm</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-white/20 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="px-6 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 1 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                1
                            </div>
                            <div className={`h-1 w-12 ${currentStep >= 2 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 2 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                2
                            </div>
                            <div className={`h-1 w-12 ${currentStep >= 3 ? "bg-indigo-600" : "bg-gray-200"}`}></div>
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    currentStep >= 3 ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-600"
                                }`}
                            >
                                3
                            </div>
                        </div>
                        <div className="text-sm font-medium text-gray-500">
                            {currentStep === 1 ? "Thông tin cơ bản" : currentStep === 2 ? "Mô tả & Hình ảnh" : "Xác nhận"}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4">
                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label htmlFor="productName" className="flex items-center text-sm font-medium text-gray-700">
                                        <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                                        Tên sản phẩm <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="productName"
                                        id="productName"
                                        placeholder="Nhập tên sản phẩm"
                                        value={formData.productName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="categoryId" className="flex items-center text-sm font-medium text-gray-700">
                                        <Layers className="w-4 h-4 mr-2 text-indigo-600" />
                                        Danh mục <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <select
                                        name="categoryId"
                                        id="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        required
                                    >
                                        <option value="">Chọn danh mục</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="salePrice" className="flex items-center text-sm font-medium text-gray-700">
                                        <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                                        Giá bán <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="salePrice"
                                            id="salePrice"
                                            placeholder="Nhập giá bán"
                                            value={formData.salePrice}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                            required
                                        />
                                        <span className="absolute left-3 top-2 text-gray-500">₫</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="originalPrice" className="flex items-center text-sm font-medium text-gray-700">
                                        <DollarSign className="w-4 h-4 mr-2 text-indigo-600" />
                                        Giá gốc
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            name="originalPrice"
                                            id="originalPrice"
                                            placeholder="Nhập giá gốc"
                                            value={formData.originalPrice}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        />
                                        <span className="absolute left-3 top-2 text-gray-500">₫</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="quantityInStock" className="flex items-center text-sm font-medium text-gray-700">
                                        <Package className="w-4 h-4 mr-2 text-indigo-600" />
                                        Số lượng tồn <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="quantityInStock"
                                        id="quantityInStock"
                                        placeholder="Nhập số lượng tồn kho"
                                        value={formData.quantityInStock}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="flex items-center text-sm font-medium text-gray-700">Trạng thái</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="show"
                                            id="show"
                                            checked={formData.show}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="show" className="text-sm text-gray-700">
                                            Hiển thị sản phẩm
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="description" className="flex items-center text-sm font-medium text-gray-700">
                                    <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                                    Mô tả sản phẩm
                                </label>
                                <textarea
                                    name="description"
                                    id="description"
                                    placeholder="Nhập mô tả chi tiết về sản phẩm"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    rows={5}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="flex items-center text-sm font-medium text-gray-700">
                                    <ImageIcon className="w-4 h-4 mr-2 text-indigo-600" />
                                    Hình ảnh sản phẩm
                                </label>
                                <div
                                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${imagePreviews.length > 0 ? "border-indigo-300" : "border-gray-300"}`}
                                    onClick={triggerFileInput}
                                >
                                    <input
                                        type="file"
                                        name="images"
                                        id="images"
                                        ref={fileInputRef}
                                        onChange={handleImageChange}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                    />

                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-4 w-full">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative">
                                                    <img
                                                        src={preview || "/placeholder.svg"}
                                                        alt={`Preview ${index + 1}`}
                                                        className="max-h-32 mx-auto object-contain"
                                                    />
                                                    {index === 0 && (
                                                        <span className="absolute top-1 left-1 bg-indigo-600 text-white text-xs px-2 py-1 rounded">
                              Ảnh chính
                            </span>
                                                    )}
                                                </div>
                                            ))}
                                            <p className="text-sm text-center text-gray-500">Nhấp để thêm hoặc thay đổi hình ảnh</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 text-center">
                                            <Upload className="w-12 h-12 mx-auto text-indigo-500" />
                                            <p className="text-gray-700 font-medium">Kéo thả hoặc nhấp để tải lên</p>
                                            <p className="text-sm text-gray-500">PNG, JPG, GIF (tối đa 5MB, nhiều ảnh)</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-medium text-gray-900">Xác nhận thông tin sản phẩm</h3>
                            <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Tên sản phẩm</p>
                                    <p className="font-medium">{formData.productName || "Chưa có thông tin"}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Danh mục</p>
                                    <p className="font-medium">
                                        {categories.find((c) => c.id === formData.categoryId)?.name || "Chưa chọn danh mục"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Giá bán</p>
                                    <p className="font-medium text-indigo-600">
                                        {formData.salePrice
                                            ? `${Number.parseInt(formData.salePrice.toString()).toLocaleString("vi-VN")}₫`
                                            : "Chưa có thông tin"}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-500">Số lượng tồn</p>
                                    <p className="font-medium">{formData.quantityInStock || "0"}</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm text-gray-500">Mô tả</p>
                                    <p className="font-medium">{formData.description || "Không có mô tả"}</p>
                                </div>
                                <div className="col-span-2 space-y-2">
                                    <p className="text-sm text-gray-500">Hình ảnh</p>
                                    {imagePreviews.length > 0 ? (
                                        <div className="grid grid-cols-2 gap-2">
                                            {imagePreviews.map((preview, index) => (
                                                <img
                                                    key={index}
                                                    src={preview || "/placeholder.svg"}
                                                    alt={`Preview ${index + 1}`}
                                                    className="h-32 object-contain"
                                                />
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">Không thay đổi hình ảnh</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                            <Check className="w-5 h-5 text-green-500 mr-2" />
                            <p className="text-green-600 text-sm">{successMessage}</p>
                        </div>
                    )}

                    <div className="mt-6 flex justify-between items-center">
                        <div>
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    Quay lại
                                </button>
                            )}
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Hủy
                            </button>
                            {currentStep < 3 ? (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
                                >
                                    Tiếp theo
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            Đang lưu...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4 mr-2" />
                                            Lưu thay đổi
                                        </>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
