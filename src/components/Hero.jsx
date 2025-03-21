import React, { useState } from 'react';
import heroImage from '../assets/images/front_info.png';
import '../assets/css/hero.css';
import Testimonials from './Testimonials';
import Talk from './Talk';
import RegisterModal from './RegisterModal'; // Import Modal

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="flex flex-col-reverse md:flex-row bg-white-800">
        {/* Video Section */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-4 md:p-8">
          <div className="rounded-lg overflow-hidden min-h-[300px] md:min-h-[400px] flex items-center justify-center bg-white-800 bg-opacity-60 p-6 md:p-8 lg:p-10 text-white max-w-2xl mx-auto">
            <section className="w-full">
              {/* Content */}
              <div className="rounded-b-md">
                <h3 className="text-xl text-black md:text-2xl font-semibold mb-4">Streamline Your Real Estate Workflow with Realist</h3>
                <ul className="list-disc pl-5 mt-2 space-y-1 text-sm md:text-base text-black">
                  <li>Realist combines advanced AI, detailed property data, and curated contractor networks to simplify your workflow and maximize client satisfaction.</li>
                </ul>
              </div>

              {/* Slogan and Info */}
              <div className="mt-6 text-center max-w-lg mx-auto">
              <button onClick={openModal} className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-cyan-600 px-6 font-medium text-white-600 transition-all duration-100 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]">
                Register
              </button>
              </div>
            </section>
          </div>
        </div>

        {/* Text and Image Section */}
        <div className="relative w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 lg:p-10 max-w-3xl mx-auto">
          <div className="relative w-full h-full">
            {/* Ensure the image covers the full area */}
            <img
              src={heroImage}
              alt="Realist"
              className="w-full h-full object-cover md:object-contain lg:object-cover rounded-lg"
            />
            {/* Overlay content */}
            <div className="absolute inset-0 flex flex-col items-start justify-center bg-white-800 bg-opacity-60 p-4 md:p-8 lg:p-12 rounded-lg">
              {/* <h1 className="retro-text font-extrabold mb-2 md:mb-4 text-2xl md:text-4xl lg:text-5xl"> */}
                {/* ANY TEXT */}
              {/* </h1> */}
              {/* <p className="text-sm md:text-lg lg:text-xl text-white mb-4 md:mb-6 lg:mb-8"> */}
                   {/* ANY TEXT */}
              {/* </p> */}
            </div>
          </div>
        </div>
      </div>

      {/* Include Modal */}
      <RegisterModal isOpen={isModalOpen} closeModal={closeModal} />

      <div className="container mx-auto px-6 py-12 bg-white">
          {/* <WhyChoose /> */}
          <Testimonials />
        </div>

        <div className="container mx-auto px-6 py-12 bg-white">
          {/* <WhyChoose /> */}
          <Talk />
        </div>

    </>
  );
};

export default Hero;
