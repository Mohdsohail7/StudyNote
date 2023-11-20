const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");



// resetPasswordToken
exports.resetPasswordtoken = async(req, res) =>{
    try {
        // get the  email from req body
        const email = req.body.email;
        // check user for this email, email validate
        const user = await User.findOne({email: email});
        if(!user){
            return res.json({
                success:false,
                message:`This Email: ${email} is not Registered With Us Enter a Valid Email `,
            });
        }
        //generate token
        const token = crypto.randomBytes(20).toString("hex");
        // update user by adding token and expiration time
        const updatedDtails = await User.findOneAndUpdate(
                                        {email:email},
                                        {
                                            token:token,
                                            resetPasswordExpires: Date.now() + 3600000,
                                        },
                                        {new:true} );
        console.log("DETAILS", updatedDtails);
        // create url
        // const url = `http://localhost:3000/update-password/${token}`;
        const url = `https://study-note-xi.vercel.app/update-password/${token}`;
        //send mail containing the url
        await mailSender(email, 
                        "Password Reset Link",
                        `Your Link for email verification is ${url}. Please click this url to reset your password.` );
        // return response
        return res.json({
            success:true,
            message:"Email Sent Successfully, Please Check Your Email to Continue Further",
        });


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while reset password",
            error:error.message,
        });
    }
}

// resetPassword
exports.resetPassword = async(req, res) => {
    try {
        // data fetch
        const {password, confirmPassword, token} = req.body;
        //validation
        if(password !== confirmPassword){
            return res.json({
                success:false,
                message:"Password and Confirm Password Does not Match",
            });
        }
        // get user details from db using token
        const userDetails = await User.findOne({token:token});
        // if no entry - invalid token
        if(!userDetails){
            return res.json({
                success:false,
                message:"Token is Invalid",
            });
        }
        // token time check
        if(userDetails.resetPasswordExpires < Date.now() ){
            return res.status(403).json({
				success: false,
				message: `Token is Expired, Please Regenerate Your Token`,
            });
        }
        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        //update password
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true},
        );
        //return response
        return res.status(200).json({
            success:true,
            message:"Password Reset Successfull",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Smoething went wrong while sending reset password mail",
        });
    }
}