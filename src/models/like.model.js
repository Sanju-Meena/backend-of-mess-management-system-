import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    menu:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "messMenu",
    },
    complaint:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Complaint"
    },
    likedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    rating:{
        type: Number,
        enum:[1,2,3,4,5],
        default: 5
    }
},{timestamps: true})

export const Like = mongoose.model("Like",likeSchema);