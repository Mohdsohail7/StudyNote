const Profile = require("../models/Profile");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
const Course = require("../models/Course");
const CourseProgress = require("../models/CourseProgress");
const {convertSecondsToDuration} = require("../utils/secToDuration");



//profileUpdate handler
exports.profileUpdate = async(req, res) => {
    try {
        // fetch data
        const {dateofBirth ="", about = "", contactNumber, gender} = req.body;
        // user id
        const id = req.user.id;
        // data validation
        if(!contactNumber || !gender || !id){
            return res.status(404).json({
                success:false,
                message:"All fields are required",
            });
        }
        
        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

       // Update the profile fields
        profileDetails.dateOfBirth = dateofBirth;
        profileDetails.about = about;
        profileDetails.contactNumber = contactNumber;
        profileDetails.gender = gender;

        // Save the updated profile
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:"Profile Updated Successfull",
            profileDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            error:error.message,
        });
    }
}


// delete account handler
exports.deleteAccount = async(req, res) => {
    try {
        // get id
        const id = req.user.id;
        console.log("Printing ID ->", id);
        // validation
        const userDetails = await User.findById({_id: id});
        if(!userDetails){
            return res.status(404).json({
                success:false,
                message:"User Not Found",
            });
        }
        // Delete Assosiated Profile with the User
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //TODO : HW uneroll user from all enrolled cousres

        // delete user
        await User.findByIdAndDelete({_id:id});
        
        // return response
        return res.status(200).json({
            success:true,
            message:"User Delete Successfully",
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User cannot be deleted successfully",
        });
    }
}


// if you want all details user
exports.getAllUserDetails = async(req, res) => {
    try {
        // get user id
        const id = req.user.id;
        // get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        // return response
        return res.status(200).json({
            success:true,
            message:"User Data fetched Successfully",
            data: userDetails,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// updatedDisplayPicture
exports.updateDisplayPicture = async(req, res) => {
    try {
        // get the  profile
        const displayPicture = req.files.displayPicture;
        // get user id
        const userId = req.user.id;
        // upload to cloudinary
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        console.log(image);
        // upadte user profile
        const updateProfile = await User.findByIdAndUpdate(
                                {_id: userId},
                                {image: image.secure_url},
                                {new:true},
        );
        //console.log(updateProfile);

        // return response
        return res.status(200).json({
            success:true,
            message:"Image Updated Succesfull",
            updateProfile,
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}

// get all enrolled Courses
exports.getEnrolledCourses = async (req, res) => {
	try {
	  const userId = req.user.id
	  let userDetails = await User.findOne({
		_id: userId,
	  })
		.populate({
		  path: "courses",
		  populate: {
			path: "courseContent",
			populate: {
			  path: "subSection",
			},
		  },
		})
		.exec()

	  userDetails = userDetails.toObject()
	  var SubsectionLength = 0
	  for (var i = 0; i < userDetails.courses.length; i++) {
		let totalDurationInSeconds = 0
		SubsectionLength = 0
		for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
		  totalDurationInSeconds += userDetails.courses[i].courseContent[
			j
		  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
		  userDetails.courses[i].totalDuration = convertSecondsToDuration(
			totalDurationInSeconds
		  )
		  SubsectionLength +=
			userDetails.courses[i].courseContent[j].subSection.length
		}
		let courseProgressCount = await CourseProgress.findOne({
		  courseID: userDetails.courses[i]._id,
		  userId: userId,
		})
		courseProgressCount = courseProgressCount?.completedVideos.length
		if (SubsectionLength === 0) {
		  userDetails.courses[i].progressPercentage = 100
		} else {
		  // To make it up to 2 decimal point
		  const multiplier = Math.pow(10, 2)
		  userDetails.courses[i].progressPercentage =
			Math.round(
			  (courseProgressCount / SubsectionLength) * 100 * multiplier
			) / multiplier
		}
	  }
  
	  if (!userDetails) {
		return res.status(400).json({
		  success: false,
		  message: `Could not find user with id: ${userDetails}`,
		})
	  }
	  return res.status(200).json({
		success: true,
		data: userDetails.courses,
	  })
	} catch (error) {
	  return res.status(500).json({
		success: false,
		message: error.message,
	  })
	}
  }

  exports.instructorDashboard = async(req, res) => {
    try {
      const instructorId = req.user.id
      const courseDetails = await Course.find({instructor:instructorId});

      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course.studentEnrolls.length;
        const totalAmountGenerated = totalStudentsEnrolled * course.price;

        // create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
        return courseDataWithStats;
      })
      return res.status(200).json({
        success:true,
        data:courseData
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success:false,
        message: "Internal Server Error"
      })
    }
  }