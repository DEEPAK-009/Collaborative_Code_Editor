// Express configuration only

const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", roomRoutes);

app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running");
});

module.exports = app;