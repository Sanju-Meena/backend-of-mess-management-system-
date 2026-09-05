// hello and welcome to the backend world of programming. This is the main entry point for the backend application. Here, we will set up the server, configure middleware, and define routes for handling requests.
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

// routes import
import userRouter from "./routes/user.routes.js";
import menuRouter from "./routes/menu.routes.js";

// routes declaration
app.use("/api/v1/users", userRouter); 
app.use("/api/v2/menu", menuRouter);


// http://localhost:8000/api/v1/user/register

export { app } 