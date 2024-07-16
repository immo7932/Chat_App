import express from "express"
import authMiddleware from "../middlewares/authMiddlewares.js";
import { accessChat, addToGroup, createGroup, fetchChat, renameGroup, removeFromGroup } from "../controllers/chatController.js";

const router = express.Router();


router.post("/accesschat", authMiddleware, accessChat)
router.get("/fetchchat", authMiddleware, fetchChat);
router.post("/createGroup", authMiddleware, createGroup)
router.put("/renameGroup", authMiddleware, renameGroup);
router.put("/addtogroup", authMiddleware, addToGroup)
router.put("/removefromgroup", authMiddleware, removeFromGroup);

export default router