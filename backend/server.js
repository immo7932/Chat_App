import express from "express"
import cors from "cors";
import chats from "./data/data.js";


const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

app.get("/api/chat", (req, res) => {
    res.json({ chats })
})

app.listen(PORT, () => {
    console.log(`server is runing on this ${PORT}`)
})