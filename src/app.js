// hello and welcome to the backend world of programming. This is the main entry point for the backend application. Here, we will set up the server, configure middleware, and define routes for handling requests.
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credientials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

export { app } 