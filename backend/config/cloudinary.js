import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary=async(filePath)=>{
        // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDNARY_CLOUD_NAME, 
        api_key: process.env.CLOUDNARY_API_KEY, 
        api_secret: process.env.CLOUDNARY_API_SECRET 
    });

    try {
            // Upload an image
     const uploadResult = await cloudinary.uploader
       .upload(filePath)
       fs.unlinkSync(filePath)
       return uploadResult.secure_url

    } catch (error) {
        fs.unlinkSync(filePath)
        return resizeBy.status(500).json({message:"cloudinary error"})
    }
}

export default uploadOnCloudinary