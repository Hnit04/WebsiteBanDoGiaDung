export const users = [
    {
        "id": 1,
        "username": "TranNgocHung",
        "password": "NgocHung",
        "email": "tranngochung19112004@gmail.com",
        "fullName": "Trần Ngọc Hưng",
        "role": "admin"
    },
    {
        "id": 2,
        "username": "TranCongTinh",
        "password": "CongTinh",
        "email": "trancongtinh20042004@gmail.com",
        "fullName": "Trần Công Tính",
        "role": "customer"
    },
    {
        "id": 3,
        "username": "HoVinhThai",
        "password": "VinhThai",
        "email": "vinhthai.2612@gmail.com",
        "fullName": "Hồ Vĩnh Thái",
        "role": "customer"
    }
]

// Save user data to localStorage
export const saveUserToLocalStorage = (user) => {
    if (!user) return

    // Store user data
    localStorage.setItem(
        "user",
        JSON.stringify({
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
        }),
    )

    // Set login status
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem("userRole", user.role)
}

// Get user data from localStorage
export const getUserFromLocalStorage = () => {
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
        return JSON.parse(userStr)
    } catch (error) {
        console.error("Error parsing user data:", error)
        return null
    }
}

// Clear user data from localStorage
export const clearUserFromLocalStorage = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userRole")
}
