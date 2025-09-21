import React from 'react';
import HeroSection from '../components/home/HeroSection';
import OffersSlider from '../components/home/OffersSlider';
import OffersPopup from '../components/home/OffersPopup';
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
      <OffersSlider />
      <HowItWorks />
      <OurServices />
      <FeaturedPoojas />
      <PoojaCollection />
      <BookPoojaCTA />
      <Testimonials />
      <OffersPopup />
    </>
  );
};

export default Home;