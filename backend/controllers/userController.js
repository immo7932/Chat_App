import User from "../Models/userModels.js";

const registerUser = async (req, res) => {
    try {
        console.log(req.body)
        const { name, email, password, pic } = req.body;

        // Check if all required fields are provided
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
            pic,
        });

        // Send success response
        res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
}

export { registerUser };
