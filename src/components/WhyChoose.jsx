import React from 'react';
import '../assets/css/MaggieAd.css'; // Import your CSS file for the modal
const MaggieAd = () => {
  return (
    <section className="text-black">
      {/* Header */}
      {/* <div className="bg-red-600 text-white text-center py-4 rounded-t-md">
        <h2 className="text-2xl md:text-3xl font-bold">MAGGIE'S MAGIC TOUCH</h2>
        <p className="text-lg">CLEANING SERVICE</p>
      </div> */}

      {/* Content */}
      <div className="bg-white p-6 rounded-b-md shadow-md">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-semibold">Experienced & Responsible!</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Homes</li>
              <li>Apartments</li>
              <li>Offices</li>
              <li>Condos</li>
            </ul>
          </div>
          <div>
          <p className="text-lg tilt-animation">Good Work at Low Prices!</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold">We offer full cleaning services:</h3>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Vacuuming • Dusting • Blinds</li>
              <li>Furniture • Stoves • Microwaves</li>
              <li>Window Sills • Cabinets • Doors</li>
              <li>Ceiling Fans and more!</li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="text-center">
          <p className="text-lg mb-2">
            <span className="font-bold">Call:</span> 267-597-7272
          </p>
          <p className="text-sm">please leave a message, we'll return your call promptly</p>
          <p className="text-sm">
            <span className="font-bold">Email:</span> margaretclean@hotmail.com
          </p>
          
        </div>
        
      </div>
      <div className="bg-blue-300 p-4 rounded-md mb-4 text-center">
          <p className="font-bold">You make the mess, we do the rest!</p>
          <p className="text-sm">Good References | FREE ESTIMATES | Call Today!</p>
        </div>
    </section>
  );
};

export default MaggieAd;
