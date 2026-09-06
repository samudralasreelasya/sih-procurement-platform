const express = require("express");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const procurementCenterRoutes = require("./routes/procurementCenter.routes");

const app = express();

app.use(express.json());

app.use("/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/procurement-centers", procurementCenterRoutes);

module.exports = app;