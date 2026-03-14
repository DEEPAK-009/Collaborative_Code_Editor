// Express configuration only

const express = require("express");
const cors = require("cors");
const roomRoutes = require("./routes/roomRoutes");
const executeRoutes = require("./routes/executeRoutes");
const authRoutes = require("./routes/authRoutes");
const passport = require("./config/passport");


const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(passport.initialize());

// these are run one after the other , so order is very imp . 
app.use("/api/auth", authRoutes);
app.use("/api", roomRoutes);
app.use("/api", executeRoutes);



app.get("/", (req, res) => {
  res.send("Collaborative Editor Backend Running");
});

module.exports = app;