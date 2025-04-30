"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EyeOff, Mail, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { loginUser } from "../services/api.js" // Import the loginUser function

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const navigate = useNavigate()

    const validateForm = () => {
        const newErrors = {}

        if (!email.trim()) {
            newErrors.email = "Email không được để trống"
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (!password) {
            newErrors.password = "Mật khẩu không được để trống"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleLogin = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Call the login API instead of using setTimeout
            const response = await loginUser(email, password)

            // Save login state
            localStorage.setItem("isLoggedIn", "true")

            // Save user info from the API response
            const userInfo = {
                email: response.user.email,
                name: response.user.username,
                username: response.user.username, // Add this line to match what Header expects
                phone: response.user.phone || "0326-829-327",
                id: response.user.id,
                role: response.user.role,
            }

            localStorage.setItem("userInfo", JSON.stringify(userInfo))
            // After localStorage.setItem("userInfo", JSON.stringify(userInfo))
            // Add this line to force header to update
            window.dispatchEvent(new Event("storage"))
            console.log("Đăng nhập thành công!", userInfo)
            alert("Đăng nhập thành công!")
            navigate("/")
        } catch (error) {
            alert(error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center p-40 bg-cover bg-center"
            style={{
                backgroundImage: "url('https://lamodepaint.vn/images/image/Tin-tuc/Tu%20van/Nam%202018/Thang%205/xanh1.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="w-full">
                <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl overflow-hidden p-8 mb-60 w-200 mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold text-black mb-6">Login</h1>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Email field */}
                        <div>
                            <label htmlFor="email" className="block text-black text-lg mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) {
                                            setErrors((prev) => ({ ...prev, email: "" }))
                                        }
                                    }}
                                    className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                        errors.email ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter your email"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <Mail size={20} className="text-black" />
                                </div>
                            </div>
                            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                        </div>

                        {/* Password field */}
                        <div>
                            <label htmlFor="password" className="block text-black text-lg mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value)
                                        if (errors.password) {
                                            setErrors((prev) => ({ ...prev, password: "" }))
                                        }
                                    }}
                                    className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-white ${
                                        errors.password ? "border-red-500" : ""
                                    }`}
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-black focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Lock size={20} />}
                                    </button>
                                </div>
                            </div>
                            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                        </div>

                        {/* Remember me and Forgot password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="h-4 w-4 text-black border-black rounded focus:ring-0 bg-transparent"
                                />
                                <label htmlFor="remember-me" className="ml-2 text-sm text-black">
                                    Remember Me
                                </label>
                            </div>
                            <a href="#" className="text-sm text-black hover:text-black/80">
                                Forget password
                            </a>
                        </div>

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-black bg-white hover:bg-white/90 focus:outline-none transition-all duration-200 ${
                                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
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
                                        Đang xử lý...
                                    </>
                                ) : (
                                    "Log in"
                                )}
                            </button>
                        </div>

                        {/* Register link */}
                        <div className="mt-4 text-center">
                            <p className="text-sm text-black">
                                Don't have a account{" "}
                                <a href="/register" className="font-medium text-black hover:text-black/80 underline">
                                    Registrer
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default LoginPage
