// backend/server.js
const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("❌ MongoDB connection error:", err))

// Define User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ["CUSTOMER", "ADMIN"], default: "CUSTOMER" },
    createdAt: { type: Date, default: Date.now },
})

// Create User model
const User = mongoose.model("User", userSchema)

// Test route
app.get("/", (req, res) => {
    res.send("API is running...")
})

// User registration route
app.post("/register", async (req, res) => {
    try {
        const { username, email, password, phone, address, role } = req.body

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] })
        if (existingUser) {
            return res.status(400).json({
                message: existingUser.email === email ? "Email đã được sử dụng" : "Tên người dùng đã tồn tại",
            })
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password, // In production, you should hash this password
            phone,
            address,
            role,
        })

        await newUser.save()

        res.status(201).json({
            message: "Đăng ký thành công",
            userId: newUser._id,
        })
    } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" })
    }
})

// User login route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body

        // Find user by email
        const user = await User.findOne({ email })

        // Check if user exists
        if (!user) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
        }

        // Check if password matches
        // Note: In production, you should compare hashed passwords
        if (user.password !== password) {
            return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" })
        }

        // Return user data (excluding password)
        const userData = {
            id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            role: user.role,
        }

        res.status(200).json({
            message: "Đăng nhập thành công",
            user: userData,
        })
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ message: "Lỗi server, vui lòng thử lại sau" })
    }
})

// Add your BanDoGiaDung route
app.get("/BanDoGiaDung", (req, res) => {
    // Replace with actual data or model query
    res.json({ message: "BanDoGiaDung data" })
})

app.listen(PORT, () => {
    console.log(`🚀 Server listening on http://localhost:${PORT}`)
})
