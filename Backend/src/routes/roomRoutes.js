const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");

router.post("/rooms", roomController.createRoom);
router.get("/rooms/:roomId", roomController.joinRoom);
router.patch("/rooms/change-role", roomController.changeRole);
router.patch("/rooms/remove-user", roomController.removeUserFromRoom);
router.patch("/rooms/transfer-ownership", roomController.transferOwnershipController);

module.exports = router;