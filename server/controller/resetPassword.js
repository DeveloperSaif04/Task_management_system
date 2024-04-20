import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import {mailSender} from "../utils/mailSender.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";


export const resetPasswordToken = catchAsyncErrors(async (req, res) => {

    try {
      const email = req.body.email
      const user = await User.findOne({ email: email })
      if (!user) {
      
          return next(new ErrorHandler( `This Email: ${email} is not Registered With Us Enter a Valid Email `, 400));

      }
      const token = crypto.randomBytes(20).toString("hex")
  
      const updatedDetails = await User.findOneAndUpdate(
        { email: email },
        {
          token: token,
          resetPasswordExpires: Date.now() + 3600000,
        },
        { new: true }
      )
      console.log("DETAILS", updatedDetails)

      const FRONTEND_URL = process.env.FRONTEND_URL; 
      // const url = `http://localhost:3000/update-password/${token}`
      const url = `${FRONTEND_URL}/update-password/${token}`
  
      await mailSender(
        email,
        "Password Reset",
        `Your Link for email verification is ${url}. Please click this url to reset your password.`
      )
  
      res.json({
        success: true,
        message:
          "Email Sent Successfully, Please Check Your Email to Continue Further",
      })
    } catch (error) {
      return res.json({
        error: error.message,
        success: false,
        message: `Some Error in Sending the Reset Message`,
      })
    }
  })





  export const resetPassword = catchAsyncErrors (async (req, res) => {
    try {
      const { password, confirmPassword, token } = req.body
  
      if (confirmPassword !== password) {
        return next(new ErrorHandler( "Password and Confirm Password Does not Match", 400));

     
      }
      const userDetails = await User.findOne({ token: token })
      if (!userDetails) {
        return next(new ErrorHandler( "Token is Invalid", 401));


      
      }
      if (!(userDetails.resetPasswordExpires > Date.now())) {
        return next(new ErrorHandler( "Token is Expired, Please Regenerate Your Token", 403));

       
      }

      console.log(userDetails)
      
      const encryptedPassword = await bcrypt.hash(password, 10)
      await User.findOneAndUpdate(
        { token: token },
        { password: encryptedPassword },
        { new: true }
      )
      res.json({
        success: true,
        message: `Password Reset Successful`,
      })
    } catch (error) {
      return res.json({
        error: error.message,
        success: false,
        message: `Some Error in Updating the Password`,
      })
    }
  }
  )