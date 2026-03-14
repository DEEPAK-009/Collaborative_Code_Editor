// Express configuration only

const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");
const executeRoutes = require("./routes/executeRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", roomRoutes);
app.use("/api", executeRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running");
});

module.exports = app;