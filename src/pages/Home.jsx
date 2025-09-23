import React, { useState, useEffect } from 'react';
import HeroSection from '../components/home/HeroSection';
import OffersSlider from '../components/home/OffersSlider';
import OffersPopup from '../components/home/OffersPopup';
import HowItWorks from '../components/home/HowItWorks';
import OurServices from '../components/home/OurServices';
import FeaturedPoojas from '../components/home/FeaturedPoojas';
import PoojaCollection from '../components/home/PoojaCollection';
import Testimonials from '../components/home/Testimonials';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate content loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner overlay={true} message="Loading home content..." />;
  }

  return (
    <>
      <HeroSection />
      {/* <OffersSlider /> */}
      <HowItWorks />
      <OurServices />
      <FeaturedPoojas />
      <PoojaCollection />
      <Testimonials />
      <OffersPopup />
    </>
  );
};

export default Home;