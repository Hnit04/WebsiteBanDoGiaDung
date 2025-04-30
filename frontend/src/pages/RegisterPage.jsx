"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { EyeOff, Mail, Lock, User, Phone, ArrowLeft } from "lucide-react"
import { registerUser } from "../services/api" // Import the new registration function

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "CUSTOMER",
        address: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [agreeTerms, setAgreeTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const [verificationCode, setVerificationCode] = useState("")
    const [userInputCode, setUserInputCode] = useState("")
    const [showVerificationModal, setShowVerificationModal] = useState(false)
    const [registerSuccess, setRegisterSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }))
        }
    }

    const validateForm = () => {
        const newErrors = {}

        if (!formData.username.trim()) {
            newErrors.username = "Tên người dùng không được để trống"
        } else if (formData.username.length < 3 || formData.username.length > 50) {
            newErrors.username = "Tên người dùng phải từ 3 đến 50 ký tự"
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email không được để trống"
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        if (!formData.password) {
            newErrors.password = "Mật khẩu không được để trống"
        } else if (formData.password.length < 8) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự"
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt"
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp"
        }

        if (formData.phone && !/^\+?[1-9]\d{1,14}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại không hợp lệ"
        }

        if (!agreeTerms) {
            newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản sử dụng"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const generateVerificationCode = () => {
        return Math.floor(100000 + Math.random() * 900000).toString() // Mã 6 chữ số
    }

    const sendVerificationEmail = (email, code) => {
        console.log(`Gửi mã xác nhận ${code} đến email: ${email}`)
        // In a real implementation, you would call your email service here
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            // Generate verification code and send via email
            const code = generateVerificationCode()
            setVerificationCode(code)
            sendVerificationEmail(formData.email, code)

            // Show verification modal
            setShowVerificationModal(true)
            setIsLoading(false) // Important: Set loading to false after showing the modal
        } catch (err) {
            setErrors({
                api: err.message || "Đăng ký thất bại. Vui lòng thử lại.",
            })
            setIsLoading(false)
        }
    }

    const handleVerifyCode = async () => {
        if (userInputCode !== verificationCode) {
            alert("Mã xác nhận không đúng. Vui lòng thử lại!")
            setUserInputCode("")
            return
        }

        setIsLoading(true)

        try {
            // Prepare payload for registration
            const payload = {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
                address: formData.address || undefined,
                role: formData.role,
            }

            // Use the dedicated registration function
            await registerUser(payload)

            // Close verification modal and show success
            setShowVerificationModal(false)
            setRegisterSuccess(true)
        } catch (err) {
            setErrors({
                api: err.message || "Đăng ký thất bại. Vui lòng thử lại.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: "url('https://lamodepaint.vn/images/image/Tin-tuc/Tu%20van/Nam%202018/Thang%205/xanh1.jpg')",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
            }}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-4xl mx-auto px-4"
            >
                <div className="backdrop-blur-md bg-white/30 rounded-3xl border border-black/20 shadow-2xl overflow-hidden p-8 w-full">
                    {/* Header */}
                    <div className="text-center mb-6 relative">
                        <a
                            href="/login"
                            className="absolute top-0 left-0 text-black/80 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-black/50 rounded-full p-1"
                        >
                            <ArrowLeft size={20} />
                            <span className="sr-only">Quay lại</span>
                        </a>
                        <h1 className="text-3xl font-bold text-black">Đăng ký</h1>
                        <p className="text-black/80 mt-2 text-sm">Tạo tài khoản để mua sắm dễ dàng hơn</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Username field */}
                            <div>
                                <label htmlFor="username" className="block text-black text-sm mb-1.5">
                                    Tên người dùng
                                </label>
                                <div className="relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        autoComplete="username"
                                        required
                                        value={formData.username}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                            errors.username ? "border-red-500" : ""
                                        }`}
                                        placeholder="Nhập tên người dùng"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <User size={18} className="text-black" />
                                    </div>
                                </div>
                                {errors.username && <p className="mt-1 text-sm text-red-400">{errors.username}</p>}
                            </div>

                            {/* Email field */}
                            <div>
                                <label htmlFor="email" className="block text-black text-sm mb-1.5">
                                    Email
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                            errors.email ? "border-red-500" : ""
                                        }`}
                                        placeholder="your.email@example.com"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <Mail size={18} className="text-black" />
                                    </div>
                                </div>
                                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                            </div>

                            {/* Phone field */}
                            <div>
                                <label htmlFor="phone" className="block text-black text-sm mb-1.5">
                                    Số điện thoại (tùy chọn)
                                </label>
                                <div className="relative">
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                            errors.phone ? "border-red-500" : ""
                                        }`}
                                        placeholder="0912345678"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <Phone size={18} className="text-black" />
                                    </div>
                                </div>
                                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                            </div>

                            {/* Address field */}
                            <div>
                                <label htmlFor="address" className="block text-black text-sm mb-1.5">
                                    Địa chỉ (tùy chọn)
                                </label>
                                <input
                                    id="address"
                                    name="address"
                                    type="text"
                                    autoComplete="street-address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black"
                                    placeholder="123 Đường ABC, Quận 1"
                                />
                            </div>

                            {/* Password field */}
                            <div>
                                <label htmlFor="password" className="block text-black text-sm mb-1.5">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                            errors.password ? "border-red-500" : ""
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-black focus:outline-none"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                            </div>

                            {/* Confirm Password field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-black text-sm mb-1.5">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black ${
                                            errors.confirmPassword ? "border-red-500" : ""
                                        }`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-black focus:outline-none"
                                        >
                                            {showConfirmPassword ? <EyeOff size={18} /> : <Lock size={18} />}
                                        </button>
                                    </div>
                                </div>
                                {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                            </div>
                        </div>

                        {/* Role field */}
                        <div>
                            <label htmlFor="role" className="block text-black text-sm mb-1.5">
                                Vai trò
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b-2 border-black/70 pb-2 text-black focus:outline-none focus:border-black"
                            >
                                <option value="CUSTOMER" className="bg-white text-black">
                                    Khách hàng
                                </option>
                                <option value="ADMIN" className="bg-white text-black">
                                    Quản trị viên
                                </option>
                            </select>
                        </div>

                        {/* Terms and conditions checkbox */}
                        <div className="flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id="terms"
                                    name="terms"
                                    type="checkbox"
                                    checked={agreeTerms}
                                    onChange={(e) => {
                                        setAgreeTerms(e.target.checked)
                                        if (e.target.checked && errors.agreeTerms) {
                                            setErrors((prev) => ({ ...prev, agreeTerms: "" }))
                                        }
                                    }}
                                    className={`h-4 w-4 text-black border-black rounded focus:ring-0 bg-transparent ${
                                        errors.agreeTerms ? "border-red-500" : ""
                                    }`}
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor="terms" className="text-black">
                                    Tôi đồng ý với{" "}
                                    <a href="#" className="text-black underline hover:text-black/80">
                                        Điều khoản sử dụng
                                    </a>{" "}
                                    và{" "}
                                    <a href="#" className="text-black underline hover:text-black/80">
                                        Chính sách bảo mật
                                    </a>
                                </label>
                            </div>
                        </div>
                        {errors.agreeTerms && <p className="mt-1 text-sm text-red-400">{errors.agreeTerms}</p>}

                        {/* API Error */}
                        {errors.api && <p className="mt-1 text-sm text-red-400">{errors.api}</p>}

                        {/* Submit button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-black bg-white hover:bg-white/70 focus:outline-none transition-all duration-200 ${
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
                                    "Đăng ký"
                                )}
                            </button>
                        </div>

                        {/* Login link */}
                        <div className="text-center">
                            <p className="text-sm text-black">
                                Đã có tài khoản?{" "}
                                <a href="/login" className="font-medium text-black underline hover:text-black/80">
                                    Đăng nhập
                                </a>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>

            {/* Verification Modal */}
            {showVerificationModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="backdrop-blur-md bg-white/50 rounded-2xl border border-black/70 p-6 w-full max-w-sm mx-4"
                    >
                        <h2 className="text-xl font-semibold text-black mb-4">Xác nhận Email</h2>
                        <p className="text-sm text-black/80 mb-4">
                            Chúng tôi đã gửi một mã xác nhận đến email <strong>{formData.email}</strong>. Vui lòng nhập mã để tiếp
                            tục.
                        </p>
                        <input
                            type="text"
                            value={userInputCode}
                            onChange={(e) => setUserInputCode(e.target.value)}
                            className="w-full bg-transparent border-b-2 border-black/70 pb-2 text-black placeholder-black/50 focus:outline-none focus:border-black"
                            placeholder="Nhập mã xác nhận"
                        />
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowVerificationModal(false)
                                    setIsLoading(false)
                                }}
                                className="px-4 py-2 text-sm font-medium text-black border border-black/30 rounded-full hover:bg-black/10 focus:outline-none transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleVerifyCode}
                                disabled={isLoading}
                                className={`px-4 py-2 text-sm font-medium text-white rounded-full focus:outline-none transition-colors ${
                                    isLoading ? "bg-gray-500 opacity-70 cursor-not-allowed" : "bg-black hover:bg-black/90"
                                }`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg
                                            className="animate-spin inline -ml-1 mr-2 h-4 w-4 text-white"
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
                                        Đang xác nhận...
                                    </>
                                ) : (
                                    "Xác nhận"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Success Modal */}
            {registerSuccess && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="backdrop-blur-md bg-green-500/20 rounded-2xl border border-green-500/30 p-8 w-full max-w-sm text-center mx-4"
                    >
                        <h2 className="text-2xl font-semibold text-green-400 mb-4">Đăng ký thành công!</h2>
                        <p className="text-sm text-white mb-6">Bạn đã đăng ký thành công. Vui lòng đăng nhập để tiếp tục.</p>
                        <button
                            onClick={() => {
                                setRegisterSuccess(false)
                                window.location.href = "/login"
                            }}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                        >
                            Đến trang đăng nhập
                        </button>
                    </motion.div>
                </div>
            )}
        </div>
    )
}

export default RegisterPage
