import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose"
import router from "./router";


const app = express();

app.use(cors({ credentials: true }));
app.use(cookieParser());
app.use(compression());
app.use(express.json());
app.use(bodyParser.json());

app.get("/", (_, res) => {
    res.json({ message: "Use the endpoints" })
});

app.use("/", router());

const server = http.createServer(app);

server.listen(8000, () => {
    console.log("Server is running at http://localhost:8000")
});


const MONGO_URL = "mongodb+srv://andystack23:oBu6T1iHIzRKC8oG@cluster0.qaddny9.mongodb.net/ts-api"


mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on("error", (error: Error) => console.log(error));