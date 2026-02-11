import express from "express";
import { createPaymentIntent,addCredits} from "../Controllers/paymentController.js";

const router = express.Router();

// ✅ Create Payment Intent Route
router.post("/create-intent", createPaymentIntent);
router.put("/users/:id/add-credits", addCredits);
export default router;
