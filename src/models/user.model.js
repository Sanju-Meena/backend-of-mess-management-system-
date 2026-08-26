import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
        required: true
    },
    password:{
        type: String,
        required: [true,"password is required"],
    },
    refreshToken:{
        type: String
    },
    role:{
        type: String,
        enum: ["student","admin","committee"],
        default: "student"
    },
    messHistory:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "MessMenu"
        }
    ]
},{timestamps: true});

userSchema.pre("save", async function () {
    if(!this.isModified("password")) return ;

    this.password = await bcrypt.hash(this.password, 10);

});

// we can make custom method ;
// we can take userSchema and take a method of ispasswordcorrect and we can compare the password with the hashed password in the database and return true or false
userSchema.methods.isPasswordCorrect = async function (password) {
     return await bcrypt.compare(password, this.password)
}

// hum jitne chahe utne methods bana sakte hai userSchema ke liye, jaise ki humne isPasswordCorrect method banaya hai, waise hi hum aur bhi methods bana sakte hai.
userSchema.methods.generateAccessToken = function () {
    // jwt k pass sign method hota hai, jisme hum payload, secret key aur options pass karte hai, aur ye hume ek token return karta hai.
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function () {

    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

export const User = mongoose.model("User",userSchema);
