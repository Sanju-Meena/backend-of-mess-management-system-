import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Messmenu } from "../models/mess.menu.model.js";
// import jwt from "jsonwebtoken";

const createMenu = asyncHandler(async(req,res) => {
    console.log("aa gaye createMenu k ander");
    let {day, breakfast, lunch, dinner} = req.body;
    if(!day || !breakfast || !lunch || !dinner ) throw new ApiError(400,"all fields are required");

    day = day.toLowerCase().trim();
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'special'];
    if (!validDays.includes(day)) throw new ApiError(400, "Invalid day spelling or name.");
    
    const checkmenu = await Messmenu.findOne({day});
    if(checkmenu) throw new ApiError(409,"menu already exist, if you want to update send info on update route ");
    
    const menu = await Messmenu.create({
        day,
        breakfast,
        lunch,
        dinner,
        owner: req.user?._id
    });
    
    if(!menu) throw new ApiError(500,"while creating menu in mongodb an error occour");
    
    const createdmenu = await Messmenu.findOne({day}) ;
    if(!createdmenu) throw new ApiError(401,"something went wrong while creating the menu");
    
    console.log("createdmenu: ", createdmenu);
    return res.status(200)
    .json(
        new ApiResponse(200, createdmenu,"menu created successfully")
    );

});

const updateMenu = asyncHandler(async(req,res) => {
    let {day,breakfast,lunch,dinner} = req.body;
    if(!day) throw new ApiError(400,"day is missing or invalid day");
    day = day.toLowerCase().trim();

    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'special'];
    if (!validDays.includes(day)) throw new ApiError(400, "Invalid day spelling or name.");

    if(!(breakfast || lunch || dinner)) throw new ApiError(400,"Atleast one field is required from breakfast, lunch, dinner");

    const newmenu = await Messmenu.findOne({day});
    if(!newmenu) throw new ApiError(404,"please first add menu, menu is missing");
    console.log("oldmenu", newmenu);

    if(breakfast) newmenu.breakfast = breakfast;
    if(dinner) newmenu.dinner = dinner;
    if(lunch) newmenu.lunch = lunch;

    await newmenu.save();

    console.log("newmenu", newmenu);

    return res.status(200)
    .json(
        new ApiResponse(200,newmenu,"menu updated successfully")
    );
});

const getMenu = asyncHandler(async(req,res) => {
    let day = req.query.day;
    if(day){
        day = day.toLowerCase().trim();
        const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'special'];
        if (!validDays.includes(day)) throw new ApiError(400, "Invalid day spelling or name.");
        
        console.log(`get ${day} menu`);
        let day_menu = await Messmenu.findOne({day}) ;
        if(!day_menu) throw new ApiError(404,`something went wrong while finding ${day_menu} menu in database`);
        console.log("menu ",day_menu);
        return res.status(200)
        .json(
            new ApiResponse(200,day_menu,"successfully done")
        );   
    }

    console.log("get full menu");
    const menu = await Messmenu.find({}) ;
    if(!menu) throw new ApiError(404,"something went wrong while finding menu in database");
    console.log("menu ", menu);
    return res.status(200)
    .json(
        new ApiResponse(200,menu,"successfully done")
    );
});


export {
    createMenu,
    updateMenu,
    getMenu
 };