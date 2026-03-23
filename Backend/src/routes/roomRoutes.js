const express = require("express");
const router = express.Router();

const roomController = require("../controllers/roomController");
const authenticateUser = require("../middleware/authMiddleware");

router.use(authenticateUser);

router.post("/rooms", roomController.createRoom);
router.get("/rooms/:roomId", roomController.getRoom);
router.post("/rooms/:roomId/join", roomController.joinRoom);
router.patch("/rooms/:roomId/members/:userId/role", roomController.changeRole);
router.delete("/rooms/:roomId/members/:userId", roomController.removeUserFromRoom);
router.post("/rooms/:roomId/transfer-ownership", roomController.transferOwnershipController);

module.exports = router;
