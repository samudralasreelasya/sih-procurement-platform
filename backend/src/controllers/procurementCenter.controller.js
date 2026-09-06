const pool = require("../config/db");

// Get all procurement centers
const getAllCenters = async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM procurement_centers ORDER BY id ASC"
        );

        res.status(200).json({
            success: true,
            centers: result.rows
        });
    } catch (error) {
        console.error("Error fetching procurement centers:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch procurement centers"
        });
    }
};

// Get one procurement center
const getCenterById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM procurement_centers WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Procurement center not found"
            });
        }

        res.status(200).json({
            success: true,
            center: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching procurement center:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch procurement center"
        });
    }
};

// Create procurement center
const createCenter = async (req, res) => {
    try {
        const {
            name,
            location,
            district,
            state,
            contact_number
        } = req.body;

        if (!name || !location || !district || !state) {
            return res.status(400).json({
                success: false,
                message: "Name, location, district and state are required"
            });
        }

        const result = await pool.query(
            `INSERT INTO procurement_centers
            (name, location, district, state, contact_number)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [name, location, district, state, contact_number || null]
        );

        res.status(201).json({
            success: true,
            message: "Procurement center created successfully",
            center: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating procurement center:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create procurement center"
        });
    }
};

module.exports = {
    getAllCenters,
    getCenterById,
    createCenter
};