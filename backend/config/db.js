import mongoose from "mongoose";

const dbConnection = async () => {
    try {
        const conn = await mongoose.connect("mongodb+srv://chatAppUser:chatApp123@chatapp.hrfakyo.mongodb.net/?retryWrites=true&w=majority&appName=chatApp");
        console.log(`MongoDB connected`);
    } catch (error) {
        console.error("Error in connecting to MongoDB:", error);
        throw error;
    }
};


//mandy01022003
//RagO66KZepPfrbRW
//mongodb+srv://mandy01022003:RagO66KZepPfrbRW@cluster0.w50qu6c.mongodb.net/
export default dbConnection;
