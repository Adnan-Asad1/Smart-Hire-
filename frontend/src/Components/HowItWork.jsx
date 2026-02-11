// HowItWorks.jsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, Link, Mic, BarChart } from "lucide-react";

const steps = [
  {
    title: "Create Interview",
    desc: "Recruiters define questions, job role, and skillset.",
    icon: <CheckCircle className="w-10 h-10" />,
  },
  {
    title: "Share Link",
    desc: "AI generates a secure link for candidates.",
    icon: <Link className="w-10 h-10" />,
  },
  {
    title: "AI Conducts Interview",
    desc: "AI interacts, evaluates, and records responses.",
    icon: <Mic className="w-10 h-10" />,
  },
  {
    title: "View Feedback",
    desc: "Get instant performance analysis and reports.",
    icon: <BarChart className="w-10 h-10" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="bg-gray-50 py-20 px-6">
      <h2 className="text-4xl font-bold text-center mb-14 tracking-tight">
        How It Works
      </h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl cursor-pointer
                       transition-all duration-300 border border-gray-100
                       hover:-translate-y-2"
          >
            <div className="flex justify-center mb-5">
              <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
                {step.icon}
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
            <p className="text-gray-600 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
