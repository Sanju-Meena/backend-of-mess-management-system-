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

const updateComplainStatus = asyncHandler(async(req,res) => {
    console.log("enter in updateComplainStatus");
    
    const { id: complaintId } = req.params;

    if(!complaintId) throw new ApiError(400, "Compalaint id is required");
    console.log("id finded");

    const { updateStatus } = req.body;

    if(!(updateStatus === "pending" || updateStatus === "ongoing" || updateStatus === "resolved")) 
        throw new ApiError(400, "Invalid status type send by backend");

    const changestatusfromdb = await Complaint.findByIdAndUpdate(
        complaintId,
        {
            $set:{
                status: updateStatus
            }
        },
        {new: true}
    );

    return res.status(200)
    .json(
        new ApiResponse(200,changestatusfromdb,"status update successfully")
    );
})

const showComplain = asyncHandler(async(req,res) => {
    console.log("enter in show complain controller");
    const allcomplain = await Complaint.find({
        status: { $in: ["pending","ongoing"] }
    });

    if(!allcomplain) throw new ApiError(500,"internal server error");

    return res.status(200)
    .json(
        new ApiResponse(200,allcomplain,"complain shown successfully")
    );
});
 
const resolvedComplain = asyncHandler(async(req,res) => {
    console.log("enter in show resolved complain controller");
    const resolvedcomplain = await Complaint.find({
        status: { $in: ["resolved"] }
    });

    if(!resolvedcomplain) throw new ApiError(500,"internal server error");
    console.log("resolved complained successfully worked");
    return res.status(200)
    .json(
        new ApiResponse(200,resolvedcomplain,"resolved complain shown successfully")
    );
});

const getMyComplaints = asyncHandler(async(req,res) => {

    const mycomplain = await Complaint.find({owner: req.user._id});

    if(!mycomplain) throw new ApiError(500,"internal server error");
    console.log("get my complints works successfully");

    return res.status(200)
    .json(
        new ApiResponse(200,mycomplain,"my complain shown successfully")
    );


});
 
export {
    complain,
    updateComplainStatus,
    showComplain,
    resolvedComplain,
    getMyComplaints
}