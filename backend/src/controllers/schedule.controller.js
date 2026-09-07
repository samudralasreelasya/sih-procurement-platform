const pool = require("../config/db");

// Get all procurement schedules
const getAllSchedules = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT ps.*, pc.name AS procurement_center_name
             FROM procurement_schedules ps
             JOIN procurement_centers pc
             ON ps.procurement_center_id = pc.id
             ORDER BY ps.schedule_date ASC, ps.start_time ASC`
        );

        res.status(200).json({
            success: true,
            schedules: result.rows
        });
    } catch (error) {
        console.error("Error fetching procurement schedules:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch procurement schedules"
        });
    }
};

// Get one procurement schedule
const getScheduleById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT
                ps.id,
                ps.procurement_center_id,
                ps.schedule_date::text AS schedule_date,
                ps.start_time,
                ps.end_time,
                ps.commodity,
                ps.max_farmers,
                ps.status,
                ps.created_at,
                ps.updated_at,
                pc.name AS procurement_center_name
             FROM procurement_schedules ps
             JOIN procurement_centers pc
             ON ps.procurement_center_id = pc.id
             WHERE ps.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Procurement schedule not found"
            });
        }

        res.status(200).json({
            success: true,
            schedule: result.rows[0]
        });
    } catch (error) {
        console.error("Error fetching procurement schedule:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch procurement schedule"
        });
    }
};

// Create procurement schedule
const createSchedule = async (req, res) => {
    try {
        const {
            procurement_center_id,
            schedule_date,
            start_time,
            end_time,
            commodity,
            max_farmers
        } = req.body;

        if (
            !procurement_center_id ||
            !schedule_date ||
            !start_time ||
            !end_time ||
            !commodity ||
            !max_farmers
        ) {
            return res.status(400).json({
                success: false,
                message: "Procurement center, date, time, commodity and maximum farmers are required"
            });
        }

        // Check whether procurement center exists
        const centerResult = await pool.query(
            "SELECT id FROM procurement_centers WHERE id = $1",
            [procurement_center_id]
        );

        if (centerResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Procurement center not found"
            });
        }

        const result = await pool.query(
            `INSERT INTO procurement_schedules
            (
                procurement_center_id,
                schedule_date,
                start_time,
                end_time,
                commodity,
                max_farmers
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                procurement_center_id,
                schedule_date,
                start_time,
                end_time,
                commodity,
                max_farmers
            ]
        );

        res.status(201).json({
            success: true,
            message: "Procurement schedule created successfully",
            schedule: result.rows[0]
        });
    } catch (error) {
        console.error("Error creating procurement schedule:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create procurement schedule"
        });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule
};