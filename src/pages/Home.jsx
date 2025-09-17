import React from 'react';
import HeroSection from '../components/home/HeroSection';
import HowItWorks from '../components/home/HowItWorks';
import OurServices from '../components/home/OurServices';
import FeaturedPoojas from '../components/home/FeaturedPoojas';
import PoojaCollection from '../components/home/PoojaCollection';
import BookPoojaCTA from '../components/home/BookPoojaCTA';
import Testimonials from '../components/home/Testimonials';

const Home = () => {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <OurServices />
      <FeaturedPoojas />
      <PoojaCollection />
      <BookPoojaCTA />
      <Testimonials />
    </>
  );
};

export default Home;