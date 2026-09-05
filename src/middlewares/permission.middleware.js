import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const checkPermission = (allowedRoles)=>{

    return asyncHandler(async(req,res,next)=>{
        try{
            if(!req.user) throw new ApiError(401,"user not founded while searching in req");
    
            let flag = 0;
            for(let i = 0;i<allowedRoles.length;i++){
                if(allowedRoles[i] === req.user.role){
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) throw new ApiError(403, "You do not have the permission to access this route");
            next();

        }catch(error){
            console.log("error message ", error);
            if (error instanceof ApiError) throw error;
            throw new ApiError(500, error?.message || "checkpermission give error");
        }
    });
}
