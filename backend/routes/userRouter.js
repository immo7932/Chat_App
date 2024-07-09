
import express from "express"
import { allUsers, login, registerUser } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";


const router = express.Router()

router.post("/register", registerUser);
router.post("/login", login)
router.get("/", authMiddleware, allUsers);

export default router;