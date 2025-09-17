import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import TestimonialCard from '../common/TestimonialCard';

// Add fonts
const fontStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Bastoni:wght@400;700&display=swap');
`;

if (!document.querySelector('#testimonials-fonts')) {
  const style = document.createElement('style');
  style.id = 'testimonials-fonts';
  style.textContent = fontStyles;
  document.head.appendChild(style);
}

const Testimonials = () => {
  const testimonials = [
    {
      testimonial: "The puja service was absolutely divine. The pandit was knowledgeable and performed every ritual with utmost devotion.",
      author: "Priya Sharma"
    },
    {
      testimonial: "Excellent service! The arrangements were perfect and the spiritual experience was truly enriching for our family.",
      author: "Rajesh Kumar"
    },
    {
      testimonial: "Professional and authentic puja services. Highly recommend for anyone seeking genuine spiritual guidance.",
      author: "Meera Patel"
    },
    {
      testimonial: "Amazing experience! The rituals were performed with great care and the spiritual atmosphere was truly divine.",
      author: "Amit Singh"
    }
  ];

  return (
    <section 
      style={{ 
        background: 'white',
        fontFamily: 'Poppins, sans-serif',
        padding: '60px 20px 40px 20px'
      }}
    >
      <div style={{ 
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(24px, 5vw, 36px)',
          fontWeight: '600',
          color: '#6B1E1E',
          marginBottom: '48px',
          fontFamily: 'Bastoni',
          textAlign: 'center'
        }}>
          Testimonials
        </h2>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            bulletClass: 'swiper-pagination-bullet',
            bulletActiveClass: 'swiper-pagination-bullet-active'
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1200: { slidesPerView: 4 }
          }}
        >
          {testimonials.map((item, index) => (
            <SwiperSlide key={index}>
              <TestimonialCard
                testimonial={item.testimonial}
                author={item.author}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;