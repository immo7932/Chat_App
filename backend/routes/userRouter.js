
import express from "express"
import { allUsers, login, registerUser } from "../controllers/userController.js";


const router = express.Router()

router.post("/register", registerUser);
router.post("/login", login)
router.get("/", allUsers);

export default router;