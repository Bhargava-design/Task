const express = require("express");
const { Pool } = require("pg");
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: "postgres",
    password: "Admin",
    host: "localhost",
    port: "5432",
    database: "my_db"
});

const CREATE_TBL_QUERY = `
    CREATE TABLE IF NOT EXISTS task2 (
        sno serial PRIMARY KEY,
        name VARCHAR (50) NOT NULL,
        mobile NUMERIC NOT NULL,
        location TEXT,
        time TIME,
        date DATE
    )`;

pool.query(CREATE_TBL_QUERY)
    .then(() => console.log("Table created successfully"))
    .catch(err => console.error("Error creating table:", err));

app.get('/api/data', async (req, res) => {
    try {
        const query = 'SELECT * FROM task2';
        const result = await pool.query(query);
        console.log("Table rows:", result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error("Error executing query:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
