import User from "../Models/userModels.js";
import upload_image from "../utils/image_upload.js";

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // let pic = '';
        let picCloud = ''
        // console.log("djvdf", req.files);
        if (req.files && req.files.pic) {
            let { pic } = req.files;
            // console.log("Image file:", image);  // Debugging log
            // console.log("Image temp file path:", image.tempFilePath);  // Debugging log

            if (pic.tempFilePath) {
                picCloud = await upload_image(pic.tempFilePath);
                // console.log(pic);
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

        // Send success response
        return res.status(201).json({ success: true, message: "User created successfully", user });
    } catch (error) {
        console.error("Error registering user:", error);
        return res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
}


const login = async (req, res) => {


    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        console.log(user)
        if (user && (await user.matchPassword(password))) {
            res.json({ success: true, message: "Login successfully" });
        } else {
            res.json({ success: false, message: "User not found with this email and password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { registerUser, login };
