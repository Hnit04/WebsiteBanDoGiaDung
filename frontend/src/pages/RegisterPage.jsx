"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Home, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        role: "CUSTOMER",
    });
    const [verificationCode, setVerificationCode] = useState("");
    const [showVerification, setShowVerification] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) newErrors.username = "Tên người dùng không được để trống";
        if (!formData.email.trim()) newErrors.email = "Email không được để trống";
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
        if (!formData.password) newErrors.password = "Mật khẩu không được để trống";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
            newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt";
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
        if (!formData.phone.trim()) newErrors.phone = "Số điện thoại không được để trống";
        else if (!/^\+84\d{9}$/.test(formData.phone)) {
            newErrors.phone = "Số điện thoại phải bắt đầu bằng +84 và có 9 chữ số sau đó (ví dụ: +84326829327)";
        }
        if (!formData.address.trim()) newErrors.address = "Địa chỉ không được để trống";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePhoneChange = (e) => {
        let phoneValue = e.target.value;
        // Nếu số bắt đầu bằng 0, chuyển thành +84
        if (phoneValue.startsWith("0")) {
            phoneValue = "+84" + phoneValue.slice(1);
        }
        setFormData({ ...formData, phone: phoneValue });
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);

        try {
            console.log("Sending data to /users:", formData);
            const response = await api.post("/users", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address,
                role: formData.role,
            });
            setShowVerification(true);
            setErrors({});
        } catch (error) {
            console.error("Error response:", error.response?.data);
            console.error("Status:", error.response?.status);
            console.error("Headers:", error.response?.headers);
            setErrors({ general: error.response?.data?.message || "Đăng ký thất bại" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async (e) => {
        e.preventDefault();

        if (!verificationCode.trim()) {
            setErrors({ verificationCode: "Mã xác nhận không được để trống" });
            return;
        }

        setIsLoading(true);

        try {
            const response = await api.post("/users/verify", {
                email: formData.email,
                code: verificationCode,
                userRequest: {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: formData.address,
                    role: formData.role,
                },
            });
            const { user, token } = response.data;

            localStorage.setItem("user", JSON.stringify(user));
            localStorage.setItem("token", token);
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("userRole", user.role);

            navigate(user.role === "ADMIN" ? "/admin" : "/");
        } catch (error) {
            setErrors({ verificationCode: error.response?.data?.message || "Mã xác nhận không hợp lệ" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-blue-600 p-6 relative">
                        <button
                            className="absolute top-6 left-6 text-white hover:text-blue-200 transition-colors"
                            onClick={() => navigate("/login")}
                        >
                            <ArrowLeft size={20} />
                            <span className="sr-only">Quay lại</span>
                        </button>
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-white">
                                {showVerification ? "Xác nhận mã" : "Đăng ký"}
                            </h1>
                            <p className="text-blue-100 mt-2">
                                {showVerification
                                    ? "Nhập mã xác nhận được gửi đến email của bạn"
                                    : "Tạo tài khoản để bắt đầu mua sắm"}
                            </p>
                        </div>
                    </div>
                    <div className="p-6">
                        {!showVerification ? (
                            <form onSubmit={handleRegister}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Tên người dùng
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.username ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="Tên của bạn"
                                            />
                                        </div>
                                        {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                            Email
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.email ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="your.email@example.com"
                                            />
                                        </div>
                                        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mật khẩu
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.password ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                            Xác nhận mật khẩu
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.confirmPassword ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="••••••••"
                                            />
                                        </div>
                                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                            Số điện thoại
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="text"
                                                value={formData.phone}
                                                onChange={handlePhoneChange} // Dùng hàm chuyển đổi
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.phone ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="+84326829327"
                                            />
                                        </div>
                                        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                    </div>
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Địa chỉ
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Home size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                id="address"
                                                name="address"
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className={`block w-full pl-10 pr-3 py-2.5 border ${
                                                    errors.address ? "border-red-500" : "border-gray-300"
                                                } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                placeholder="123 Đường ABC, Quận 1"
                                            />
                                        </div>
                                        {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {isLoading ? (
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
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                "Đăng ký"
                                            )}
                                        </button>
                                    </div>
                                </div>
                                {errors.general && <p className="mt-4 text-sm text-red-600 text-center">{errors.general}</p>}
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyCode}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700 mb-1">
                                            Mã xác nhận
                                        </label>
                                        <input
                                            id="verificationCode"
                                            name="verificationCode"
                                            type="text"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                            className={`block w-full px-3 py-2.5 border ${
                                                errors.verificationCode ? "border-red-500" : "border-gray-300"
                                            } rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                            placeholder="Nhập mã xác nhận"
                                        />
                                        {errors.verificationCode && <p className="mt-1 text-sm text-red-600">{errors.verificationCode}</p>}
                                    </div>
                                    <div>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                                isLoading ? "opacity-70 cursor-not-allowed" : ""
                                            }`}
                                        >
                                            {isLoading ? (
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
                                                    Đang xử lý...
                                                </>
                                            ) : (
                                                "Xác nhận"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        )}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {showVerification ? (
                                    <>
                                        Đã có tài khoản?{" "}
                                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                            Đăng nhập
                                        </a>
                                    </>
                                ) : (
                                    <>
                                        Đã có tài khoản?{" "}
                                        <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
                                            Đăng nhập ngay
                                        </a>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                <p className="mt-4 text-center text-xs text-gray-500">© 2025 Home Craft. Tất cả các quyền được bảo lưu.</p>
            </motion.div>
        </div>
    );
};

export default RegisterPage;