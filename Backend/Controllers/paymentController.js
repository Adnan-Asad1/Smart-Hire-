import Stripe from "stripe";
import { User } from '../models/userModel.js'

import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe("sk_test_51S4ExTLCxr5t4KSKMtS8N7yK67RhCkHrd2ghHbLEAy75MNIeEuqyCDUrNVufp37IpCK2veqfVBuhMoWW4QxIIkTL002lRMLiI0");

// 🎯 Function to create payment intent
export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }

    // Create PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // amount in cents
      currency: "usd",
      payment_method_types: ["card"],
       description:"This is payment of the user"
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Payment Intent Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 🎯 Add credits after successful payment
export const addCredits = async (req, res) => {
  try {
    const { id } = req.params;
    const { interviews } = req.body;

    if (!interviews || isNaN(interviews)) {
      return res.status(400).json({ error: "Valid interviews count required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // increment credits
    user.credits = (user.credits || 0) + parseInt(interviews);
    await user.save();

    res.json({
      message: "✅ Credits updated successfully",
      credits: user.credits,
    });
  } catch (error) {
    console.error("Add credits error:", error);
    res.status(500).json({ error: "Server error" });
  }
};
