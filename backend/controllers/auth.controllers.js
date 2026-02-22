import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import genToken from "../config/token.js";
import { json } from "express";

 export const signUp= async(req, res)=>{
try {
    const { name, email, password}=req.body
    console.log(req.body);
    

    const existEmail=await User.findOne({email})

    if(existEmail){
        return res.status(400).json({message:"Email Already Exists !"})
    }
    if(password.length<6){
        return res.status(400).json({message:"Password to short ! only 6 characters !"})
    }
    
    const hashedPassword=await bcrypt.hash(password,10)

    const user=await User.create({
        name,password:hashedPassword,email
    })

    const token=await genToken(user._id)

    res.cookie("token", token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:false
    })

    return res.status(201).json(user)


} catch (error) {
    console.log(error);
    
     return res.status(500).json({message:`Sign up Error $ {error}`})
}
}

export const Login= async(req, res)=>{
try {
    const { email, password}=req.body

    const user =await User.findOne({email})

    if(!user){
        return res.status(400).json({message:"Email Does Not  Exists !"})
    }
   const isMatch=await bcrypt.compare(password, user.password)

   if(!isMatch){
    return res.status(400).json({message:"Incorrect Password"})
   }

    const token=await genToken(user._id)

    res.cookie("token", token,{
        httpOnly:true,
        maxAge:7*24*60*60*1000,
        sameSite:"strict",
        secure:false
    })

    return res.status(200).json(user)


} catch (error) {
     return res.status(500).json({message:`Login Error $ {error}`})
}
}


export const logOut=async (req, res)=>{
    try {
        res.clearCookie("token")
        return res.status(200).json({message:"Logout Successfully"})
    } catch (error) {
        return res.status(500),json({message:`Logout Error ${Error}`})
    }
}