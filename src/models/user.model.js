import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    avatar: {
        type: String, //cloudnary url
    },
    password:{
        type: String,
        required: [true,"password is required"],
    },
    refreshToken:{
        type:String
    },
    role:{
        type: String,
        enum: ["student","admin"],
        default: "student"
    },
    messHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MessMenu"
        }
    ]
},{timestamps: true});

export const User = mongoose.model("User",userSchema);