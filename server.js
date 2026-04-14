const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔌 DB CONNECTION
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "beanboard"
});

db.connect(err => {
    if (err) {
        console.log("❌ DB connection failed:", err.message);
    } else {
        console.log("✅ Connected to MariaDB");
    }
});

// 🏠 TEST ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
    res.send("BeanBoard API is running 🚀");
});

// 🔐 LOGIN API
app.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Missing fields"
        });
    }

    const sql = "SELECT * FROM users WHERE username = ?";

    db.query(sql, [username], (err, result) => {
        if (err) {
            return res.json({
                success: false,
                message: "Database error"
            });
        }

        if (result.length === 0) {
            return res.json({
                success: false,
                message: "User not found"
            });
        }

        const user = result[0];

        // ⚠️ plain password check
        if (password === user.password) {
            return res.json({
                success: true,
                user: {
                    id: user.id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    username: user.username
                }
            });
        } else {
            return res.json({
                success: false,
                message: "Incorrect password"
            });
        }
    });
});

// 🚀 START SERVER
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});