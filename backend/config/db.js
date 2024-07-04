import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect("mongodb://localhost:27017/chat-app", {
        });
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error.message);
        throw error;
    }
};

export default dbConnection;
