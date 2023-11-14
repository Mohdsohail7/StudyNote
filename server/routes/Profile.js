const express = require("express")
const router = express.Router()
const { auth, isInstructor } = require("../middlewares/auth")

// Import the Profile controllers
const{
    profileUpdate,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    getEnrolledCourses,
    instructorDashboard,
} = require("../controllers/Profile");

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************

// Delete User Account
router.delete("/deleteProfile", auth, deleteAccount);

// update user account
router.put("/updateProfile", auth, profileUpdate);

// get all details for user
router.get("/getUserDetails", auth, getAllUserDetails);

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses);

// upadte profile picture
router.put("/updateDisplayPicture", auth, updateDisplayPicture);

// instructor Dashboard 
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;