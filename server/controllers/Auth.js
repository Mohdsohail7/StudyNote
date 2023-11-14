const User = require("../models/User");
const OTP = require("../models/Otp");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const Profile = require("../models/Profile");
require("dotenv").config();


// sentOPT Handler
exports.sendOTP = async(req, res) => {
    try {
        // fetch email from req.body
        const{email} = req.body;

        // check if user already exist
        const checkUserPresent = await User.findOne({email});
        // check if user already exist, then return a response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User already registered",
            });
        }

        // generate OTP
        var otp = otpGenerator.generate(6, {
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP Generated -> ",otp);

        // check unique otp or not and generete opt when you got unique otp
        const result = await OTP.findOne({otp: otp});

        while(result){
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
                
            });
           // result = await OTP.findOne({otp:otp});
        }

        // create otp object for save in DB
        const otppayload = {email, otp};

        // create an entry in DB
        const otpBody = await OTP.create(otppayload);
        console.log("OTP BODY -> ",otpBody);

        // return response successfully
        res.status(200).json({
            success:true,
            message:"OTP Sent Successfully",
            otp,
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}



// signUp handler
exports.signUp = async(req, res) => {
    try {
        // data fetch from req.body
        const {
            firstName,
			lastName,
			email,
			password,
			confirmPassword,
			accountType,
			contactNumber,
			otp,
        } = req.body;

        // data validate
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All Fields are required",
            });
        }

        // // Check if password and confirm password match
        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm Password do not match. Please try again.",
            });
        }
        // check user already exist or not
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists. Please sign in to continue.",
            });
        }

        //find most reccent OTP stored for the user
        const recentOtp = await OTP.find({email}).sort({createdAt: -1}).limit(1);
        console.log(recentOtp);
        // vlidate otp
        if(recentOtp.length === 0){
            // OTP not found
            return res.status(400).json({
                success:false,
                message:"OTP Not Found",
            });
        }else if(otp !== recentOtp[0].otp){
            // Invalid OTP
            return res.status(400).json({
                success:false,
                message:"OTP doesn't match",
            });
        }
        

        //hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
		let approved = "";
		approved === "Instructor" ? (approved = false) : (approved = true);

        //create entry in DB
        // create profile for additional detail
        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        });

        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType:accountType,
            approved:approved,
            additionalDetails:profileDetails._id,
            image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        // return res
        return res.status(200).json({
            success:true,
            message:"User is registered Successfully",
            user,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"User cannot be registered, please try again",
        });
    }
}


// login Handler
exports.login = async(req, res) => {
    try {
        // get data from req body
        const{email, password} = req.body;

        //validate data
        if(!email || !password){
            return res.status(403).json({
                success:false,
                message:"All fields are required, please try again",
            });
        }
        // user check exist or not
        const user = await User.findOne({email}).populate("additionalDetails"); // without populate is fine
        if(!user){
            return res.status(401).json({
                success:false,
                message:"User is not registered, please signup first",
            });
        }
        // generate JWT, after password matching
        if(await bcrypt.compare(password, user.password)){
            const payload = {
                email: user.email,
                id: user._id,
                accountType: user.accountType,
            }
            const token = jwt.sign(payload, process.env.JWT_SECRET, {
                expiresIn:"2h",
            });
            user.token = token;
            user.password = undefined;

            //create cookie and send response
            const options = {
                expires:new Date(Date.now() + 3*24*60*60*1000),
            }
            res.cookie("token", token, options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged in Successfully",
            });
        }else{
            return res.status(401).json({

                success:false,
                message:"Password doesn't match",
            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure, please try again",
        });
    }
}


// changePassword handler
exports.changePassword = async(req, res) => {
    try {
        //get user data from req.user
        const userDetails = await User.findById(req.user.id);

        // get data from req body get oldPassword, newPassword, ConfrimNewpassword
        const {oldPassword, newPassword, confirmPassword} = req.body;

        // validate old password
        const isPasswordMatch = await bcrypt.compare(
            oldPassword,
            userDetails.password
        );
        if(!isPasswordMatch){
            //if old password does not match, return a 401 (Unauthorized) error
            return res.status(401).json({
                success:false,
                message:"The password is incorrect",
            });
        }

        // Match new password and confirm new password
        if(newPassword !== confirmPassword){
            // If new password and confirm new password do not match, return a 400 (Bad Request) error 
            return res.status(400).json({
                success:false,
                message:"The password and confirm password does not match",
            });
        }

        // update pwd in DB
        const encryptedPassword = await bcrypt.hash(newPassword, 10);
        const updatedUserDetails  = await User.findByIdAndUpdate(
            req.user.id,
            {password: encryptedPassword},
            {new:true},
        );
        // send mail -> Password updated
        try {
            const emailResponse = await mailSender(
				updatedUserDetails.email,
				passwordUpdated(
					updatedUserDetails.email,
					`Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
				)
			);
			console.log("Email sent successfully:", emailResponse.response);
        } catch (error) {
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
			console.error("Error occurred while sending email:", error);
			return res.status(500).json({
				success: false,
				message: "Error occurred while sending email",
				error: error.message,
			});
        }

        // return response
        return res.status(200).json({
            success:true,
            message:"Password updated successfully",
        });
    } catch (error) {
        // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while updating password:", error);
        return res.status(500).json({
            success:false,
            message:"Error occurred while updating password",
            error:error.message,
        });
    }
}