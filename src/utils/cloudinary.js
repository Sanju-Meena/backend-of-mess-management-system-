import { v2 as cloudinary } from 'cloudinary';
// v2 as cloudinary ,matlab :Cloudinary walo ne apne tool ka ek naya version nikala jiska naam unhone v2 rakha. Humne code mein 
// asaani ke liye v2 ka naam badal kar wapas cloudinary rakh diya taaki aage code likhte waqt hume baar-baar v2 na likhna pade.

import fs from "fs"; 
//fs stand for file system, inbuilt tool of node.js used to read , write, delete of file that upload on server;
// Iska kaam hota hai aapke computer ya server ke folders aur files ke sath chhedchhaad karna.
// Is code mein iska use hum temporary file ko delete karne ke liye karenge jab file Cloudinary par upload ho jayegi tb.

console.log("Mera Cloud Name hai: ", process.env.CLOUDINARY_CLOUD_NAME);

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, //username on cloudinary
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Matlab: Yeh line Cloudinary ko login ya authenticate karne ke liye hai. Yeh aapke backend ko batati hai ki 
// kis Cloudinary account ke andar files ko upload karna hai;
// Humne credentials ko directly code mein nahi likha (jaise cloud_name: "my_name"). Humne process.env ka use kiya hai,
//  jiska matlab hai ki yeh saari sasti aur secret details ek alag .env file se aa rahi hain, taaki credentials chura na sake jab aap code GitHub par push karo;

const uploadOnCloudinary = async (localFilePath)=>{
    // Ek asynchronous function banaya jo localfilepath (jaise './public/temp/image.jpg') input leta hai
    try {
        if(!localFilePath){
            console.log("localFilePath is not found, please check the path of the file you are trying to upload on cloudinary");
            return null;
        }
        
        const response =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
            // 'resource_type: "auto"' ka matlab hai Cloudinary khud pehchan lega ki yeh image hai, video hai ya pdf.
        })
        
        // Console mein print kar rahe hain ki upload ho gaya aur sath mein us file ka naya internet URL check kar rahe hain
        console.log("file is uploaded on cloudinary",response.url);
        
        fs.unlinkSync(localFilePath);  // Jab file cloud par chali gayi, toh apne local system se delete kar do! mtlb public folder se delete kr doo;
       console.log("response", response);
       return response; // Agar upload successful raha, toh Cloudinary se mila pura data (URL, public_id, etc.) wapas bhej do
        
    } catch (error) {
        console.log("cloudinary upload error",error);
        fs.unlinkSync(localFilePath) ;
        // remove the file from local storage if there is an error while uploading to cloudinary;
        return null;
    }
}

export {uploadOnCloudinary}
// Exporting the function so it can be imported and reused anywhere in the project (like in controllers or routes);