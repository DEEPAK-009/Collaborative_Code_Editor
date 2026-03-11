// Express configuration only

const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");
const executeRoutes = require("./routes/executeRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", roomRoutes);
app.use("/api", executeRoutes);

app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running");
});

module.exports = app;