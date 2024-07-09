import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const authMiddleware = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1]; // Extract token from "Bearer <token>"
    if (!token) {
        return res.json({ success: false, message: "Not Authorized Login again" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }
        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error" });
    }
};

export default authMiddleware;
