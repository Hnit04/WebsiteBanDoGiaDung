// components/AdminLayout.jsx
import { useState, useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Menu, AlertTriangle } from 'lucide-react'
import MenuAdmin from "./MenuAdmin"
import { users, clearUserFromLocalStorage } from "../assets/js/userData"
import { Link } from "react-router-dom"

export default function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchQuery, setSearchQuery] = useState("")
    const navigate = useNavigate()

    // Toggle sidebar
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    // Handle logout
    const handleLogout = () => {
        clearUserFromLocalStorage()
        setUser(null)
        navigate("/login")
    }

    // Handle search
    const handleSearch = (e) => {
        setSearchQuery(e.target.value)
    }

    // Validate admin user
    useEffect(() => {
        // Find admin user from hardcoded users array
        const adminUser = users.find((u) => u.role === "admin")
        if (!adminUser) {
            setError("Không tìm thấy tài khoản admin. Vui lòng đăng nhập.")
            navigate("/login")
            return
        }
        setUser(adminUser)
        setIsLoading(false)
    }, [navigate])


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
            {/* Sidebar Menu (Now includes the header) */}
            <MenuAdmin
                user={user}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                handleLogout={handleLogout}
                searchQuery={searchQuery}
                handleSearch={handleSearch}
            />

            {/* Main Content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <main className="flex-1 overflow-auto p-4 lg:p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}