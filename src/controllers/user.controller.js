import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req,res)=>{
    // take the username, email, fullName, avatar, password, role from the request body
    // check any required field is empty in the request body  
    //  check user exist by username or email in the database

    // check files is empty or not if not empty then upload the
    //  file to cloudinary and get the url and store in avatar field in the database
    // check the role is valid or not if not valid then return error
    // check the password and store in db and  send the encrypted password into request body
    // call to form refresh token and access token to store in db;
    
    const {username, email,fullName, password, role} = req.body;
    console.log("register user", req.body);

    if(!email || !username || !fullName || !password || !role) {
        throw new ApiError(400,"All fields are required");
    }

    if(role != "student"){
         throw new ApiError(400,"Please select the valid role");
    }
    
    const existedUser = await User.findOne({
        $or: [{ username },{ email }]
    });
    
    if(existedUser) throw new ApiError(409,"User already exists");

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    if(!avatarLocalPath) throw new ApiError(400,"Avatar local path is  not found");  
    
    console.log("avatarLocalPath", avatarLocalPath);
    console.log("req.files", req.files);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar) throw new ApiError(400, "Avatar file is required");

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        email,
        password,
        username: username.toLowerCase(),
        role
    });

    const createdUser =  await User.findById(user._id).select(
        "-password refreshToken"
    );

    if(!createdUser){
         throw new ApiError(500,"Something went wrong while creating the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

});

export {registerUser};