import React from "react";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-white to-blue-50 text-gray-700 pt-16 pb-10 border-t border-blue-100">
      <div className="container mx-auto px-5 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Column 1 - Brand */}
        <div>
          <h2 className="text-2xl font-bold text-blue-700 mb-4">
            OfficeManageAI
          </h2>
          <p className="text-gray-600 mb-5">
            Smart. Fast. Efficient.  
            AI-driven office management to streamline HR, employee, and admin operations.
          </p>
          <div className="flex space-x-4">
            <a
              href="#"
              className="hover:text-blue-600 transition"
              aria-label="Facebook"
            >
              <Facebook size={22} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition"
              aria-label="Twitter"
            >
              <Twitter size={22} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition"
              aria-label="LinkedIn"
            >
              <Linkedin size={22} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition"
              aria-label="Instagram"
            >
              <Instagram size={22} />
            </a>
            <a
              href="#"
              className="hover:text-blue-600 transition"
              aria-label="Email"
            >
              <Mail size={22} />
            </a>
          </div>
        </div>

        {/* Column 2 - Product */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Product</h3>
          <ul className="space-y-3">
            <li>
              <a href="#features" className="hover:text-blue-500 transition">
                Features
              </a>
            </li>
            <li>
              <a href="#pricing" className="hover:text-blue-500 transition">
                Pricing
              </a>
            </li>
            <li>
              <a href="#demo" className="hover:text-blue-500 transition">
                Request Demo
              </a>
            </li>
            <li>
              <a href="#testimonials" className="hover:text-blue-500 transition">
                Testimonials
              </a>
            </li>
          </ul>
        </div>

        {/* Column 3 - Resources */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Resources</h3>
          <ul className="space-y-3">
            <li>
              <a href="#blog" className="hover:text-blue-500 transition">
                Blog
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-blue-500 transition">
                FAQs
              </a>
            </li>
            <li>
              <a href="#support" className="hover:text-blue-500 transition">
                Support
              </a>
            </li>
            <li>
              <a href="#careers" className="hover:text-blue-500 transition">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 - Contact */}
        <div>
          <h3 className="text-xl font-semibold text-blue-700 mb-4">Contact Us</h3>
          <p className="text-gray-600 mb-3">
            📍 123 AI Street, Innovation City, USA
          </p>
          <p className="text-gray-600 mb-3">📞 +1 (555) 123-4567</p>
          <p className="text-gray-600 mb-3">✉️ support@officemanageai.com</p>
        </div>
      </div>

      {/* Divider Line */}
      <div className="border-t border-blue-100 mt-10 pt-6 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} <span className="text-blue-700 font-semibold">OfficeManageAI</span>. 
          All rights reserved. | Designed with ❤️ using React & TailwindCSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
