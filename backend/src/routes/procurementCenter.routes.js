const express = require("express");

const {
    getAllCenters,
    getCenterById,
    createCenter
} = require("../controllers/procurementCenter.controller");

const router = express.Router();

// Get all procurement centers
router.get("/", getAllCenters);

// Get procurement center by ID
router.get("/:id", getCenterById);

// Create procurement center
router.post("/", createCenter);

module.exports = router;