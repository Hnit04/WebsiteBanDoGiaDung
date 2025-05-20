import axios from "axios";

const api = axios.create({
    baseURL: " https://websitebandogiadung.onrender.com/api/", // Sử dụng proxy đến API Gateway
});

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

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            sessionStorage.removeItem("user");
            sessionStorage.removeItem("token");
            window.location.href = "/login"; // Sửa lỗi cú pháp
        }
        return Promise.reject(error);
    }
);

export default api;