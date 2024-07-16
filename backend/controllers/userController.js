import { query } from "express";
import User from "../Models/userModels.js";
import upload_image from "../utils/image_upload.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        let picCloud = '';
        if (req.files && req.files.pic) {
            let { pic } = req.files;

            if (pic.tempFilePath) {
                picCloud = await upload_image(pic.tempFilePath);
            } else {
                return res.json({ success: false, message: "provide image" });
            }
        }

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Please provide all details" });
        }

        // Check if the user already exists
        const existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Create new user
        const user = await User.create({
            name,
            email,
            password,
            pic: picCloud,
        });

        let token = '';
        if (user) {
            token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });
        }
        // console.log(token)
        // Send success response
        return res.status(201).json({
            success: true,
            message: "Registered Successfully",
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            pic: user.pic,
            token
        });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
};





const login = async (req, res) => {


    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        /// console.log(user)
        if (user && (await user.matchPassword(password))) {
            const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1d' });


            res.json({
                success: true, message: "Login Successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                pic: user.pic,
                token
            });
        } else {
            res.json({ success: false, message: "User not found with this email and password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


const allUsers = async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } }
            ]
        }
        : {};

    try {
        const users = await User.find(keyword);
        const filteredUsers = users.filter(user => user._id.toString() !== req.user._id.toString());
        res.send(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).send({ success: false, message: "Server error" });
    }
}

export { registerUser, login, allUsers };
