const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");

router.post("/rooms", roomController.createRoom);
router.get("/rooms/:roomId", roomController.joinRoom);

module.exports = router;