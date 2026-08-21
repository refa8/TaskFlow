const express = require("express");
// const pool = require("./config/db");
const app = express();
const projectRoutes =  require("./routes/projectRoutes");
const port = 5000;

app.use(express.json());
app.use("/api/projects", projectRoutes);
// app.get("/", (req, res) => {
//   res.send('TaskFlow API is running');
// });

// app.get('/test-db', async (req, res) => {
//   try {
//     const result = await pool.query('SELECT NOW()');
//     res.json({ message: 'Database connection successful', time: result.rows[0].now });
//   } catch (error) {
//     console.error('Database connection error:', error);
//     res.status(500).json({ message: 'Database connection failed', error: error.message });
//   }
// });

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


