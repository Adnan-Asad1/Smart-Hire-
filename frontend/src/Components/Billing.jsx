import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import toast, { Toaster } from "react-hot-toast";
import HRLeftSideBar from "./HRLeftSideBar";

const stripePromise = loadStripe(
  "pk_test_51S4ExTLCxr5t4KSK5rCUYBfmmM1AkevynwOcw7RO3fFMLFm2xnu0pCdBcv1UWngd2vuaIkrrlEkBKPTFb9OTo1Hn00QE58CLOE"
); // 🔑 Replace with your Stripe publishable key

// ✅ Checkout Form Component
const CheckoutForm = ({ selectedPlan, closeModal,userId}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // Call backend to create PaymentIntent
      const res = await fetch("http://localhost:5000/api/payment/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseInt(selectedPlan.price.replace("$", "")) * 100, // cents
          
        }),
      });

      const { clientSecret } = await res.json();

      // Confirm Payment
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === "succeeded") {

         // update credits manually
  await fetch(`http://localhost:5000/api/payment/users/${userId}/add-credits`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ interviews: parseInt(selectedPlan.interviews) }),
  });

        toast.success("✅ Payment Successful!");
        closeModal();
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#32325d",
              "::placeholder": { color: "#a0aec0" },
            },
            invalid: { color: "#fa755a" },
          },
        }}
        className="border rounded-lg px-3 py-2"
      />

      <div className="flex justify-end mt-6 gap-3">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {loading ? "Processing..." : `Pay ${selectedPlan.price}`}
        </button>
      </div>
    </form>
  );
};

const Billing = () => {
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");
  const [credits, setCredits] = useState(0); // ✅ state for credits
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // ✅ Fetch user info from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserName(parsedUser.fullName);
      setUserId(parsedUser.id); // ✅ get loggedIn user id
    }
  }, []);

  useEffect(() => {
    // ✅ Fetch credits from backend using userId
    if (userId) {
      fetch(`http://localhost:5000/api/auth/users/${userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setCredits(data.user.credits);
          }
        })
        .catch((err) => console.error("Error fetching credits:", err));
    }
  }, [userId]);

  const handlePurchaseClick = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedPlan(null);
    setShowModal(false);
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Toaster position="top-right" reverseOrder={false} />

      {/* Sidebar */}
     <HRLeftSideBar/>

      {/* Main Content */}
      <div className="flex-1 px-10 py-8 overflow-y-auto ml-64 p-6">
        {/* Welcome Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-2 tracking-tight">
            Welcome Back, {userName || "Guest"} 👋
          </h2>
          <p className="text-gray-500 text-md font-medium">
            AI-Driven Interviews, Hassle-Free Hiring
          </p>
        </div>

       {/* Billing Section */}
<div>
  <h3 className="text-3xl font-extrabold text-gray-900 mb-8">Billing</h3>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {/* Left Card - Your Credits */}
    <div className="md:col-span-1 bg-white rounded-2xl shadow-md border border-gray-200 flex flex-col overflow-hidden hover:shadow-lg transition">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 bg-gray-50">
        <span className="bg-blue-100 text-blue-600 text-2xl p-3 rounded-xl shadow-sm">
          💳
        </span>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Your Credits</h4>
          <p className="text-sm text-gray-500">Current interview balance</p>
        </div>
      </div>

      {/* Credits Display */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <p className="text-5xl font-extrabold text-gray-900">{credits}</p>
        <p className="text-gray-500 font-medium mt-2">Interviews Left</p>
      </div>

      {/* Footer Button */}
      <div className="p-6 border-t border-gray-100 bg-gray-50">
        <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white w-full py-3 px-4 rounded-xl font-semibold shadow-md transition transform hover:scale-[1.02]">
          + Add More Credits
        </button>
      </div>
    </div>

    {/* Right Side - Purchase Plans */}
    <div className="md:col-span-3 bg-white shadow-lg rounded-2xl border border-gray-200 p-8">
      <h4 className="text-2xl font-bold text-gray-900 mb-2">Purchase Credits</h4>
      <p className="text-gray-500 mb-8 text-sm">
        Choose a plan and add more interviews to your account
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
        {[
          {
            name: "Basic",
            price: "$5",
            interviews: "20",
            color: "from-green-400 to-emerald-500",
            features: ["Basic interview templates", "Email support"],
          },
          {
            name: "Standard",
            price: "$12",
            interviews: "50",
            color: "from-blue-500 to-indigo-500",
            features: [
              "All interview templates",
              "Priority support",
              "Basic analytics",
            ],
          },
          {
            name: "Pro",
            price: "$25",
            interviews: "120",
            color: "from-purple-500 to-pink-500",
            features: [
              "All interview templates",
              "24/7 support",
              "Advanced analytics",
            ],
          },
        ].map((plan, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-2xl shadow-md border border-gray-200 flex flex-col p-6 transition transform hover:scale-[1.02] hover:shadow-xl"
          >
            {/* Badge */}
            <div
              className={`bg-gradient-to-r ${plan.color} text-white px-3 py-1 rounded-full text-xs font-semibold w-fit mb-4`}
            >
              {plan.name}
            </div>

            {/* Price */}
            <p className="text-3xl font-extrabold text-gray-900 mb-1">
              {plan.price}
            </p>
            <p className="text-gray-500 mb-4">{plan.interviews} interviews</p>

            {/* Features */}
            <ul className="text-gray-700 text-sm space-y-3 flex-1 mb-6">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center">
                  <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                  {f}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              onClick={() =>
                handlePurchaseClick({
                  name: plan.name,
                  price: plan.price,
                  interviews: plan.interviews,
                })
              }
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2.5 px-4 rounded-lg font-semibold w-full shadow-md transition"
            >
              Purchase Credits
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>

      </div>

      {/* Modal with Stripe */}
      {showModal && selectedPlan && (
        <div className=" flex items-center justify-center absolute inset-0 bg-gray-100/40 backdrop-blur-[2px] transition-opacity z-50">
          <div className="bg-white rounded-2xl shadow-lg p-8 w-[400px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedPlan.name} Plan
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Price: {selectedPlan.price}
            </p>
            <p className="text-gray-600 mb-6">
              Includes: {selectedPlan.interviews} interviews
            </p>

            <Elements stripe={stripePromise}>
              <CheckoutForm
                selectedPlan={selectedPlan}
                closeModal={closeModal}
                userId={userId}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
