import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized. Login again." });
    }

    try {
        // Log the token to debug
        // console.log("Token:", token);

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Log the decoded token to debug
        // console.log("Decoded Token:", decoded);

        const user = await User.findById(decoded.userId).select("-password");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user; // Attach user to request
        next();
    } catch (error) {
        console.error("JWT verification error:", error);
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

export default authMiddleware;
