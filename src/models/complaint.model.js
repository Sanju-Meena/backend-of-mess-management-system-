import mongoose from "mongoose";

const complaintSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        trim: true
    },
    category:{
        type: String,
        required: true,
        enum: ["food-quality","cleanliness","timing","others"],
        lowercase: true,
        trim: true,
    },
    status:{
        type: String,
        enum:["pending","resolved","ongoing"],
        default: "pending"
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true});

export const Complaint = mongoose.model("Complaint",complaintSchema);