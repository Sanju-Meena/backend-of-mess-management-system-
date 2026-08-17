// command use for install mongoose, express , dotenv;
// as early as possible configure dotenv so that our environment is available everywhere; 

// import mongoose from "mongoose";
// import {DB_NAME} from "./constants.js";


import dotenv from "dotenv";
import connectDB from "./db/index.js";

// to allocate env variable in all files;
dotenv.config({path: './.env'});


connectDB()
.then(()=>{
    app.on("error", (error)=>{
        console.log("err", error);
        throw error;
    })

    app.listen(process.env.PORT || 8000,() => {
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })

})
.catch((err)=>{
    console.log("Error in connecting to DB", err);
    process.exit(1);
})