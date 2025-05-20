export const users = []


// Save user data to localStorage
export const saveUserToLocalStorage = (user) => {
    if (!user) return

    // Store user data
    localStorage.setItem(
        "user",
        JSON.stringify({
            userId: user.userId,
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address,
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
