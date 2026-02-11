import React from "react";
import { Quote } from "lucide-react"; // for elegant quote icon

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "HR Manager, TechNova",
      image:
        "https://randomuser.me/api/portraits/women/68.jpg",
      quote:
        "OfficeManageAI transformed our hiring process! The AI interviewer gives precise, unbiased feedback — now we hire 40% faster.",
    },
    {
      name: "David Miller",
      role: "CEO, BlueSky Solutions",
      image:
        "https://randomuser.me/api/portraits/men/12.jpg",
      quote:
        "Our employee productivity has skyrocketed! The dashboard and task tracking are simply world-class. Absolutely love the design and workflow.",
    },
    {
      name: "Aisha Khan",
      role: "HR Executive, CloudEdge",
      image:
        "https://randomuser.me/api/portraits/women/45.jpg",
      quote:
        "Managing interviews used to take days. With OfficeManageAI, we get candidate analysis and decision feedback instantly. Total game-changer!",
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-5 text-center">
        <h2 className="text-4xl font-bold mb-4 text-gray-800">
          What Our Clients Say
        </h2>
        <p className="text-gray-600 mb-12">
          Hear from HR leaders and executives using OfficeManageAI to transform their workflow.
        </p>

        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white shadow-lg hover:shadow-2xl transition rounded-2xl p-8 relative overflow-hidden"
            >
              {/* Decorative Quote Icon */}
              <div className="absolute top-4 right-4 text-blue-100 text-5xl">
                <Quote className="w-10 h-10 text-blue-200" />
              </div>

              {/* User Image */}
              <div className="flex justify-center mb-6">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-20 h-20 rounded-full border-4 border-blue-100 shadow-md"
                />
              </div>

              {/* Quote Text */}
              <p className="text-gray-700 italic mb-6">
                “{t.quote}”
              </p>

              {/* User Info */}
              <h3 className="text-lg font-semibold text-gray-800">
                {t.name}
              </h3>
              <p className="text-sm text-blue-600">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
