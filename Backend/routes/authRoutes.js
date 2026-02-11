import express from 'express'
import { registerUser, loginUser ,forgotPassword, verifyOtpAndReset,sendInterviewLinkToCandidate, getAllHRs, updateHR, deleteHR,createHRByAdmin  } from '../Controllers/authController.js'
import { getHRById } from "../Controllers/authController.js";

const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/forgot-password', forgotPassword);
router.post('/send-interview-link', sendInterviewLinkToCandidate);
// router.post('/reset-password/:token', resetPassword);
router.post('/verify-otp-reset', verifyOtpAndReset);



// Crud by the admin
router.get("/getAllHRs",getAllHRs);
router.put("/updateHR/:id",updateHR);
router.delete("/deleteHR/:id",deleteHR);
router.post("/createHRByAdmin",createHRByAdmin )



router.get("/users/:id", getHRById);




export default router