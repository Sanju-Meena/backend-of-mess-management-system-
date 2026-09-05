import {asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Complaint } from "../models/complaint.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const complain = asyncHandler(async(req,res) => {
    
    const {content, category} = req.body;
    const problemLocalImage = req.file?.path;
    
    if(!(content || problemLocalImage)) throw new ApiError(401, "complain text or photo is required");
    
    let image_path = "";
    if(problemLocalImage){
        const cloudinary_response = await uploadOnCloudinary(problemLocalImage);
        if(!cloudinary_response?.url) throw new ApiError(401, "something went wrong while uploading on cloudinary"); 
        image_path = cloudinary_response.url;
    }

    const complaint = await Complaint.create(
        {
            content,
            category,
            image: image_path,
            complaner_name: req.user?.fullName,
            owner: req.user?._id            
        }
    );

    return res.status(200)
    .json(
        new ApiResponse(200,complaint,"complaint register successfully")
    );
});

export {
    complain
}