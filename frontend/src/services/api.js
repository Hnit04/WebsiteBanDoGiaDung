import axios from "axios";

// Tạo instance axios với cấu hình cơ bản
const api = axios.create({
    baseURL: "https://websitebandogiadung-dqzs.onrender.com/api/", // Xóa khoảng trắng thừa
    withCredentials: true, // Gửi cookie nếu cần, phù hợp với backend
});

// Xử lý request interceptor (kết hợp cả token và CORS)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        // Không thêm token cho endpoint đăng ký và đăng nhập
        if (token && config.url !== "/users" && config.url !== "/users/login") {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Xử lý response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            window.location.href = "/login";
        }
        console.error("API error:", error.message || error); // Log lỗi chi tiết
        return Promise.reject(error);
    }
);

// Hàm gọi API SEPay
export const createSepayPayment = async (payload) => {
    try {
        const response = await api.post("/payments/sepay", payload);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Không thể tạo giao dịch SEPay");
    }
};

// Hàm kiểm tra trạng thái giao dịch
export const checkTransactionStatus = async (paymentId) => {
    try {
        const response = await api.get(`/payments/${paymentId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Lỗi kiểm tra trạng thái giao dịch");
    }
};

export default api;