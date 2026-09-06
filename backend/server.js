require("dotenv").config();

const app = require("./src/app");
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

pool.query("SELECT NOW()", (err, result) => {
    if (err) {
        console.error("Database connection failed:", err.message);
    } else {
        console.log("Database connected:", result.rows[0]);
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});