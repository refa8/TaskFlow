const express = require("express");
// const pool = require("./config/db");
const app = express();
const projectRoutes =  require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
const port = 5000;

app.use(express.json());
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/auth", authRoutes);


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


