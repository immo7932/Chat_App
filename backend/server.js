import express from "express"
import cors from "cors";
import chats from "./data/data.js";
import dbConnection from "./config/db.js";
import userRouter from './routes/userRouter.js'
import fileUpload from "express-fileupload";
// import { urlencoded } from "body-parser";


const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());
app.use(express.json())
app.use(express.urlencoded())
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" }));
dbConnection()


app.use("/api/v1/user", userRouter)

app.listen(PORT, () => {
    console.log(`server is runing on this ${PORT}`)
})