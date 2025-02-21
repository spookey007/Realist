import React from 'react';
import backgroundImg from '../assets/images/services/background.jpeg'; // Adjust this path to your background image
const About = () => {
  return (
    <section 
      className="flex bg-gray-100 py-10" 
      style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-10">Realist</h2>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto">
          Hello World.
        </p>
      </div>
    </section>
  );
};

export default About;
