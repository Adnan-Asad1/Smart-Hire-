import React from 'react';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import Features from './FeatureSection';
import HowItWorks from './HowItWork';
import Testimonials from './Testimonials';
import CTA from './CTA';
import Footer from './Footer';

const Home = () => {
  return (
    <div className="bg-white text-gray-800">
      <Navbar />
      <HeroSection />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default Home;
