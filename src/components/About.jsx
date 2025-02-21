import React from 'react';
import backgroundImg from '../assets/images/services/background.jpeg'; // Adjust this path to your background image
const About = () => {
  return (
    <section 
      className="flex bg-gray-100 py-10" 
      style={{ backgroundImage: `url(${backgroundImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-10">Maggie's Magic Touch</h2>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto">
          In a world bustling with distractions, maintaining a clean and inviting space can often feel like a daunting task. This is where <strong>Maggie’s Magic Touch</strong> steps in—a name synonymous with quality cleaning services that elevate both homes and businesses into havens of comfort and hygiene.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Founded over a decade ago, Maggie’s Magic Touch began as a dream nurtured by its namesake, Maggie. With an eye for detail and a passion for cleanliness, Maggie recognized that the environment we inhabit profoundly impacts our well-being. Thus, she embarked on a journey to transform cluttered spaces into sanctuaries of serenity. Her goal was simple: to provide exceptional cleaning services that make every customer feel valued and every home shine.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          What sets Maggie’s Magic Touch apart is not just the expertise of its professional team, but also the deep-rooted belief in the importance of creating lasting relationships with clients. Every interaction is approached with warmth and sincerity, ensuring that each client feels heard and understood. This personalized approach has fostered a loyal customer base that keeps coming back, knowing that they can rely on Maggie and her team to deliver results that exceed expectations.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          At Maggie’s Magic Touch, no job is too small or too large. Whether it’s a cozy apartment needing a thorough spring cleaning or a bustling office requiring regular maintenance, the team is equipped with the right tools and techniques to tackle any cleaning challenge. They pride themselves on using eco-friendly products that are safe for both the environment and the families they serve, ensuring that each cleaning session leaves behind a healthier home.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Maggie’s Magic Touch also believes in the power of a clean space to enhance productivity and well-being. A clutter-free environment not only looks great but also encourages creativity and tranquility. This philosophy drives the team to go above and beyond, ensuring that every corner of your space radiates freshness and cleanliness.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Over the years, Maggie’s Magic Touch has grown from a humble venture into a thriving business known for its reliability and quality. The dedication to excellence is reflected in their work ethic, as they strive to bring joy to every home and office they service.
        </p>
        <p className="text-white text-lg leading-relaxed max-w-3xl mx-auto mt-6">
          Join Maggie’s Magic Touch on a journey to transform your space into a sparkling oasis. Experience the difference of professional cleaning done with heart, and discover why so many people trust Maggie and her team to bring magic into their homes.
        </p>
      </div>
    </section>
  );
};

export default About;
