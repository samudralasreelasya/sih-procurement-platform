const express = require("express");
const authenticateToken = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SIH Procurement Backend is running"
    });
});

router.get("/protected", authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You accessed a protected route",
        user: req.user
    });
});

module.exports = router;