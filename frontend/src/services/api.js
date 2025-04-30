const API_BASE = "http://localhost:5000" // URL của backend

export const fetchSomething = async () => {
    const res = await fetch(`${API_BASE}/BanDoGiaDung`)
    return res.json()
}

// Add a specific function for user registration
export const registerUser = async (userData) => {
    try {
        const response = await fetch(`${API_BASE}/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Registration failed")
        }

        return await response.json()
    } catch (error) {
        console.error("Registration error:", error)
        throw error
    }
}

// Add function for user login
export const loginUser = async (email, password) => {
    try {
        const response = await fetch(`${API_BASE}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.message || "Đăng nhập thất bại")
        }

        return await response.json()
    } catch (error) {
        console.error("Login error:", error)
        throw error
    }
}
