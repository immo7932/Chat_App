import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js";
import { sendMessage, allMessage } from "../controllers/messageController.js";



const router = express.Router();

router.post("/", authMiddleware, sendMessage)
router.get("/:chatId", authMiddleware, allMessage);

export default router;