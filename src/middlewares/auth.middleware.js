import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
 
// verifyJWT mai ham user ki info daal rhe req object mai; 
export const verifyJWT = asyncHandler(async(req,_, next)=>{
    try{
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        console.log("token finded");

        if(!token) throw new ApiError(401,"Unauthorized request hai");
        
        console.log("make decoded token");
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET );
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
        
        if(!user) throw new ApiError(401,"Invalid accessToken");
        
        req.user = user;
        console.log("auth vali file perfectly executed");
        next();
    
    }
    catch(error){
        console.log("EXACT JWT ERROR -->", error);
        throw new ApiError(401,error?.message || "invalid access token");
    }
 });