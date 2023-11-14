// import required modules
const express = require("express");
const router = express.Router();

// Import the Controllers

// Course Controller Import
const{
    createCourse,
    getAllCourses,
    getCourseDetails,
    getFullCourseDetails,
    editCourse,
    getInstructorCourses,
    deleteCourse,
} = require("../controllers/Course");

// Categories Controllers Import
const{
    createCategory,
    showAllCategories,
    categoryPageDetails,
} = require("../controllers/Category");

// Section Controllers Import
const{
    createSection,
    updateSection,
    deleteSection,
} = require("../controllers/Section");

// SubSection Controllers  Import
const{
    createSubSection,
    updateSubSection,
    deleteSubSection,
} = require("../controllers/SubSection");

// Rating and Reviews Controllers Import
const{
    creatingRating,
    getAverageRating,
    getAllRatingReview,
} = require("../controllers/RatingAndReview");

// CourseProgress Controller import
const{
    updateCourseProgress
} = require("../controllers/courseProgress");

// Importig Middlewares
const{auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth");

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can only be Created by Instructor
router.post("/createCourse", auth, isInstructor, createCourse);

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection);

// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection);

// Add s Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Update Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection);

// Delete a Sub Section 
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection);

// Get all Registered Courses
router.get("/getAllCourses", getAllCourses);

// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)

// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)

// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

// Delete a Course
router.delete("/deleteCourse", deleteCourse)

// courseProgress route
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO:  Put isAdmin Middleware here
//const{ auth, isAdmin} = require("../middlewares/auth");
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, creatingRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRatingReview);

module.exports = router;