import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;        //refresh token add in user ;
        await user.save({validateBeforeSave: false}); //save hone se pahele kuch check na hoo;
        return {accessToken,refreshToken};
    }
    catch(error){
        throw new ApiError(500,"something went wrong while generating access and refresh token");
    }
}

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
    // console.log("req.files", req.files);

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
        "-password -refreshToken"
    );

    if(!createdUser){
         throw new ApiError(500,"Something went wrong while creating the user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    );

});

const loginUser = asyncHandler(async(req,res)=>{
    // take username and password
    // check username is exist or not
    // password is correct or not
    // generate accesstoken and refresh token 
    // send in cookies

    console.log("Hello i am entering in loginUser field");

    const{username, email, password} = req.body;
    if(!password) throw new ApiError(400,"password is required");
    if(!username && !email) throw new ApiError(400,"username or email is required");

    const user = await User.findOne({
        $or:[{username},{email}]
    });
    if(!user) throw new ApiError(400,"username is incorrect");
    
    const ispasswordcorrect = await user.isPasswordCorrect(password);
    if(!ispasswordcorrect) throw new ApiError(400,"Password is incorrect");

    const{accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id);
    
    // send to cookie;
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    const options = {
        httpOnly: true, 
        secure:  true   
        //server se modify hogi cookie only;
    }
     
    console.log("Login successfully");

    return res.status(200)
    .cookie("accessToken", accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        //statuscode, data, message tha iske format mai ;
        new ApiResponse(200,{ user: loggedInUser, accessToken, refreshToken }
            ,"User logged In successfully")
        );

});

const logoutUser = asyncHandler(async(req,res)=>{
    //user find karenge and then by making custom middleware 
    // user k refresh and access token hatayenge mongodb se with the help of cookie;
    console.log("entering logout route");
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {refreshToken: undefined}
        },
        { new: true }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    console.log("Logout successfully");

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{},"user loggedout successfully"));

});

// const refreshAccessToken = asyncHandler(async(req,res)=>{
//     req.co
// })


export {
    registerUser,
    loginUser,
    logoutUser   
};