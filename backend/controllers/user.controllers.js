import mongoose from "mongoose";
import User from "../models/user.model.js";
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiresponse from "../gemini.js";
import moment from "moment"

// Get current user details (excluding password)
export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// Update assistant details for current user
export const updateAssistant = async (req, res) => {
  try {
    const userId = req.userId;
    const { assistantName, imageUrl } = req.body;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    let assistantImage = imageUrl;

    // If a file is uploaded, upload it to Cloudinary
    if (req.file?.path) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    }

    // Update user document
    await User.findByIdAndUpdate(
      userId,
      {
        assistantName,
        assistantImage,
      },
      { new: true }
    );

    // Fetch updated user (excluding password)
    const updatedUser = await User.findByIdAndUpdate( req.userId,{
      assistantName, assistantName},{new:true}).select("-password")
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error in updateAssistant:", error);
    return res.status(400).json({ message: "Internal server error", error: error.message });
  }
};

// gemini response
export const askToAssistant=async (req,res)=>{
  try {
    const {command}=req.body
    const user=await User.findById(req.userId);
    user.history.push(command);
    user.save()
    const userName=user.name
    const assistantName=user.assistantName
    const result=await geminiresponse(command,assistantName,userName)

    const jsonMatch=result.match(/{[\s\S]*}/)
    if(!jsonMatch){
      return res.status(400).json ({response:"sorry, i can't understand "})
    }
    const gemResult=JSON.parse(jsonMatch[0])
    console.log(gemResult)
    const type=gemResult.type
    

    switch(type){
      case 'get-date' :
        return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current date is ${moment().format("YYYY-MM-DD")}`
        });
        case 'get-day':
          return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current day is ${moment().format("dddd")}`
        });
        case 'get-month':
          return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current month is ${moment().format("MMMM")}`
        });
        case 'get-time':
          return res.json({
          type,
          userInput:gemResult.userInput,
          response:`current time is ${moment().format("hh:mm:ss A")}`
        });
        case 'google-search' :
        case 'youtube-search' :
        case 'youtube-play' :
        case 'general' :
        case "calculator-open" :
        case "instagram-open" :
        case "facebook-open" :
        case "weather-show" :
          return res.json({
            type,
            userInput:gemResult.userInput,
            response: gemResult.response,
          });

          default:
            return res.status(400).json({response: " I did't understand that command."})
    }

  
  } catch (error) {
    return res.status(500).json({response: "ask assistant error "})
  }
}
