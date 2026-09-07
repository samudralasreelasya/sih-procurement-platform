const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const procurementCenterRoutes = require("./routes/procurementCenter.routes");
const scheduleRoutes = require("./routes/schedule.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/procurement-centers", procurementCenterRoutes);
app.use("/api/schedules", scheduleRoutes);

module.exports = app;