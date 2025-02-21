import React from 'react';
import Slider from 'react-slick'; // Import react-slick
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'; // Import slick carousel CSS

const testimonialsData = [
  {
    name: 'Transistor',
    review: 'Hello World',
  },
  {
    name: 'Reform',
    review: 'Hello World',
  },
  {
    name: 'Tuple',
    review: 'Hello World',
  },
  {
    name: 'SavvyCal',
    review: 'Hello World',
  },
  {
    name: 'Statamic',
    review: 'Hello World',
  },
  // Add more testimonials as needed
];

const Testimonials = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3, // Show two reviews at a time (adjust based on design)
    slidesToScroll: 1,
    autoplay: true,  // Auto-play enabled
    autoplaySpeed: 3000, // Change slides every 3 seconds
    responsive: [
      {
        breakpoint: 1024, // For medium-sized screens, show 2 slides
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 768, // For small screens, show 1 slide at a time
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <section className="bg-gray-100 py-12 md:py-20">
      <div className="container mx-auto px-4 text-center">
        {/* Section Title */}
        <h2 className="text-2xl md:text-4xl font-bold text-black mb-8 md:mb-10">
        Trusted by the world’s most innovative teams
        </h2>
        
        {/* Slider */}
        <Slider {...settings}>
          {testimonialsData.map((testimonial, index) => (
            <div key={index} className="px-4">
              <div className="bg-white shadow-lg p-4 md:p-6 rounded-lg">
                {/* Generate avatar using UI Avatars */}
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&size=100`}
                  alt={testimonial.name}
                  className="mx-auto rounded-full h-20 w-20 md:h-24 md:w-24 mb-4"
                />
                <p className="text-gray-700 italic mb-2 md:mb-4">
                  "{testimonial.review}"
                </p>
                <h3 className="text-lg md:text-xl font-semibold text-yellow-500">
                  {testimonial.name}
                </h3>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Testimonials;
