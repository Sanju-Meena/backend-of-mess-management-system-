import mongoose from "mongoose";

const messMenuSchema = new mongoose.Schema({
    day:{
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    breakfast:{
        type: String,
        required: true,
        trim: true
    },
    lunch:{
        type: String,
        required: true,
        trim: true
    },
    dinner:{
        type: String,
        trim: true
    },
    snacks:{
        type: String,
        trim: true
    },
    isavailable:{
        type: Boolean,
        default: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true});

export const messMenu = mongoose.model("messMenu",messMenuSchema);