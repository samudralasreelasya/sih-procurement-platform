const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const register = async (req, res) => {
    console.log("REQUEST BODY:", req.body);

    try {
        const { phone, password } = req.body;

        // 1. Validate input
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required"
            });
        }

        // 2. Check whether user already exists
        const existingUser = await pool.query(
            "SELECT id FROM users WHERE phone = $1",
            [phone]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            });
        }

        // 3. Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // 4. Save user
        const result = await pool.query(
            `INSERT INTO users (phone, password_hash)
             VALUES ($1, $2)
             RETURNING id, phone, role, is_active, created_at`,
            [phone, passwordHash]
        );

        // 5. Return safe user data
        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

const login = async (req, res) => {
    try {
        const { phone, password } = req.body;

        // 1. Validate input
        if (!phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Phone and password are required"
            });
        }

        // 2. Find user by phone
        const result = await pool.query(
            `SELECT id, phone, password_hash, role, is_active
             FROM users
             WHERE phone = $1`,
            [phone]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone or password"
            });
        }

        const user = result.rows[0];

        // 3. Check whether account is active
        if (!user.is_active) {
            return res.status(403).json({
                success: false,
                message: "Account is inactive"
            });
        }

        // 4. Compare entered password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid phone or password"
            });
        }

        // 5. Create JWT
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // 6. Return safe user data + token
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                phone: user.phone,
                role: user.role,
                is_active: user.is_active
            }
        });

    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    register,
    login
};