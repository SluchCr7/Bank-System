const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const { generateAccessToken, generateRefreshToken } = require("../Middelwares/generateToken");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone, balance } = req.body;

    // 1. Validate required fields
    if (!name || !email || !password || balance === undefined) {
        res.status(400);
        throw new Error("Please add all required fields, including balance.");
    }

    // 2. Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists with this email.");
    }

    // 3. Create user (Password hashing is automatically handled by the pre-save hook in your schema)
    const user = await User.create({
        name,
        email,
        password,
        phone,
        balance,
    });

    if (user) {
        // 4. Generate Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // 5. Securely send Refresh Token in HTTP-only Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Prevent JavaScript from accessing the cookie (XSS protection)
            secure: process.env.NODE_ENV === "production", // Send only over HTTPS in production
            sameSite: "strict", // Prevent CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days matching token expiration
        });

        // 6. Send Response
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            accessToken, // Used by frontend (in memory/Redux/Context) for API requests
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                balance: user.balance,
                isAdmin: Boolean(user.isAdmin),
            },
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data.");
    }
});

// @desc    Authenticate a user & get token (Login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Validate inputs
    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide both email and password.");
    }

    // 2. Find user by email
    const user = await User.findOne({ email });

    // 3. Check user existence and compare password using schema method
    if (user && (await user.comparePassword(password))) {
        // Generate Tokens
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        // Set Refresh Token in HTTP-only Cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send Response
        res.json({
            success: true,
            message: "Logged in successfully",
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                balance: user.balance,
                isAdmin: Boolean(user.isAdmin),
            },
        });
    } else {
        res.status(401);
        throw new Error("Invalid email or password.");
    }
});

module.exports = {
    registerUser,
    loginUser,
};