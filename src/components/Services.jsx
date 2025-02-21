import React from 'react';
import { FaBath, FaUtensils, FaCouch, FaBed } from 'react-icons/fa'; // Import FontAwesome icons

const servicesList = [
  {
    name: "Bathrooms",
    icon: <FaBath className="text-blue-900 text-5xl" />,
    headingone: "On Every Visit We Clean:",
    headingonedetails: [
      "Showers and other high-touch areas cleaned and sanitized.",
      "Toilets thoroughly cleaned and sanitized.",
      "Shower doors, vanity, sinks, and counters wiped.",
      "Floors cleaned and sanitized; carpets vacuumed.",
      // Additional details added based on image
      "Mirrors cleaned.",
      "Towels restocked if provided.",
      "Waste bins emptied.",
      "Air fresheners checked and replaced if necessary."
    ],
    headingtwo: "On Detail Rotation Day, We Add:",
    headingtwodetails: [
      "Tile grouting scrubbed.",
      "Shower door tracks cleaned.",
      "Additional hand-wiping of doors, frames, and cabinets.",
      // Additional details added based on image
      "Exhaust fans dusted.",
      "Behind toilets cleaned.",
      "Light fixtures dusted and cleaned."
    ],
  },
  {
    name: "Kitchen & Eating Areas",
    icon: <FaUtensils className="text-blue-900 text-5xl" />,
    headingone: "On Every Visit We Clean:",
    headingonedetails: [
      "Counters and high-touch surfaces wiped and sanitized.",
      "Sinks cleaned and chrome fixtures shined.",
      "Appliance exteriors wiped.",
      "Floors swept, vacuumed, and mopped.",
      // Additional details added based on image
      "Tables and chairs wiped down.",
      "Waste bins emptied.",
      "Small appliances wiped.",
      "Inside of the refrigerator spot cleaned if necessary."
    ],
    headingtwo: "On Detail Rotation Day, We Add:",
    headingtwodetails: [
      "Inside of microwave cleaned.",
      "Cabinet fronts hand-wiped.",
      "Range top scrubbed thoroughly.",
      // Additional details added based on image
      "Oven cleaned if necessary.",
      "Dishwasher wiped down inside and out.",
      "Pantry shelves dusted."
    ],
  },
  {
    name: "Living Areas",
    icon: <FaCouch className="text-blue-900 text-5xl" />,
    headingone: "On Every Visit We Clean:",
    headingonedetails: [
      "Furniture and décor dusted.",
      "Floors cleaned and sanitized; carpets vacuumed.",
      "Cobwebs removed and surfaces wiped.",
      // Additional details added based on image
      "Cushions and throws arranged.",
      "Light switches and door handles disinfected.",
      "Remotes and electronics dusted."
    ],
    headingtwo: "On Detail Rotation Day, We Add:",
    headingtwodetails: [
      "Detailed dusting of baseboards and window sills.",
      "Upholstery vacuumed.",
      // Additional details added based on image
      "Artwork and picture frames cleaned.",
      "Bookshelves dusted and organized."
    ],
  },
  {
    name: "Sleeping Areas",
    icon: <FaBed className="text-blue-900 text-5xl" />,
    headingone: "On Every Visit We Clean:",
    headingonedetails: [
      "Beds made; linens changed if provided.",
      "Floors cleaned and carpets vacuumed.",
      "Surfaces dusted and cobwebs removed.",
      // Additional details added based on image
      "Nightstands wiped down.",
      "Light fixtures cleaned.",
      "Closets straightened and organized."
    ],
    headingtwo: "On Detail Rotation Day, We Add:",
    headingtwodetails: [
      "Detailed dusting of baseboards and window sills.",
      "Doors and frames wiped clean.",
      // Additional details added based on image
      "Behind and under furniture dusted.",
      "Mirrors cleaned and organized."
    ],
  },
];

const Services = () => {
  return (
    <section className="flex bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h2 className="rounded-full shadow-lg text-3xl font-bold text-center mb-8 text-blue-900 bg-gray-300 w-64 mx-auto">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-4 gap-y-8">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-lg overflow-hidden text-center relative transform transition h-100 duration-300 ease-in-out hover:scale-105 hover:shadow-2xl p-4"
            >
              <div className="flex justify-center mb-4">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-blue-900 mb-2">{service.name}</h3>
              <h4 className="text-blue-900 font-bold mb-2">{service.headingone}</h4>
              <ul className="list-disc text-left pl-4 mt-2 space-y-1 text-blue-900">
                {service.headingonedetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
              <h4 className="text-blue-900 font-bold mt-4 mb-2">{service.headingtwo}</h4>
              <ul className="list-disc text-left pl-4 mt-2 space-y-1 text-blue-900">
                {service.headingtwodetails.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
