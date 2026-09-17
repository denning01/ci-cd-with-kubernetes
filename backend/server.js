const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "appdb",
    user: process.env.DB_USER || "appuser",
    password: process.env.DB_PASSWORD || "password"
});

app.get("/api/hello", (req, res) => {
    res.json({
        message: "Hello from the Kubernetes backend!"
    });
});

app.get("/api/messages", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM messages ORDER BY id"
        );

        res.json(result.rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to retrieve messages"
        });
    }
});

app.post("/api/messages", async (req, res) => {
    try {
        const { message } = req.body;

        const result = await pool.query(
            "INSERT INTO messages (message) VALUES ($1) RETURNING *",
            [message]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Failed to create message"
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});