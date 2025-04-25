import axios from "axios";

const api = axios.create({
    baseURL: "/api", // Dùng proxy, không cần hardcode URL
    // baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api", // Cách cũ
});

// Interceptor để thêm token vào header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor để xử lý lỗi 401
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
        return Promise.reject(error);
    }
);

export default api;