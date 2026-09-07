const express = require("express");

const {
    getAllSchedules,
    getScheduleById,
    createSchedule
} = require("../controllers/schedule.controller");

const router = express.Router();

// Get all procurement schedules
router.get("/", getAllSchedules);

// Get procurement schedule by ID
router.get("/:id", getScheduleById);

// Create procurement schedule
router.post("/", createSchedule);

module.exports = router;