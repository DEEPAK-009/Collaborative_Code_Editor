// Express configuration only
const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");
const executeRoutes = require("./routes/executeRoutes");
const authRoutes = require("./routes/authRoutes");
const passport = require("./config/passport");

const app = express();
const corsOrigin = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api", roomRoutes);
app.use("/api", executeRoutes);

app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running");
});

module.exports = app;
