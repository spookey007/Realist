// src/components/Videos.jsx

import React from 'react';
import ReactPlayer from 'react-player';
import backgroundImg from '../assets/images/services/background.jpeg'; // Adjust this path to your background image

// Import local video files
import video1 from '../assets/videos/1.mp4';
import video2 from '../assets/videos/2.mp4';
import video3 from '../assets/videos/3.mp4';
import video4 from '../assets/videos/4.mp4';
import video5 from '../assets/videos/5.mp4';
import video6 from '../assets/videos/6.mp4';

const Videos = () => {
  // Local video URLs
  const videoUrls = [
    video1,
    video2,
    video3,
    video4,
    video5,
    video6,
  ];

  return (
    <section 
      className="flex bg-gray-100 py-10" 
      style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto">
        <h2 className="rounded-full shadow-lg text-3xl font-bold text-center mb-8 text-blue-900 bg-gray-300 w-64 mx-auto">Videos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videoUrls.map((url, index) => (
            <div 
              key={index} 
              className="rounded-lg overflow-hidden shadow-lg transition-transform duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
            >
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer 
                  url={url} 
                  className="react-player" 
                  width="100%" 
                  height="100%" 
                  controls={true} 
                  light={false} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Videos;
