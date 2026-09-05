import mongoose from "mongoose";

const messMenuSchema = new mongoose.Schema({
    day:{
        type: String,
        enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'special'],
        required: [true, 'Please specify the day of the menu.'],
        unique: true
    },
    breakfast:{
        type: [String],
        trim: true
    },
    lunch:{
        type:  [String],
        trim: true
    },
    dinner:{
        type:  [String],
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

export const Messmenu = mongoose.model("Messmenu", messMenuSchema);