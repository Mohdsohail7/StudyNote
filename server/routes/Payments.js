// Import the required modules
const express = require("express")
const router = express.Router()

// import Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middlewares/auth")

// import Payments Controllers
const { capturePayment, verifyPayment, sendPaymentSuccessEmail } = require("../controllers/Payments")

// ********************************************************************************************************
//                                      Payments routes
// ********************************************************************************************************

router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/verifyPayment",auth, isStudent, verifyPayment)
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;

