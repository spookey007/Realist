import React from 'react';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

const About = () => {
  return (
    <section className="w-full min-h-[calc(60vh-60px)] flex items-center justify-center px-4 py-10 md:px-12 md:py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className="w-full max-w-4xl text-center space-y-6 md:space-y-8"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white">
          <span className="text-cyan-600">
            <Typewriter
              words={[
                'Welcome to Realist',
                'Connecting Contractors & Realtors',
                'Build. Connect. Grow.',
              ]}
              loop={true}
              cursor
              cursorStyle="|"
              typeSpeed={70}
              deleteSpeed={50}
              delaySpeed={2000}
            />
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-700 leading-relaxed"
        >
          <strong className="text-cyan-600">Realist</strong> is your trusted platform that bridges the gap between
          <strong className="text-cyan-600"> real estate professionals </strong> and
          <strong className="text-cyan-600"> licensed contractors</strong>. Whether you're a realtor, builder, homeowner, or investor, Realist connects you to top-tier service providers—seamlessly and efficiently.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-gray-700 dark:text-gray-700 leading-relaxed"
        >
          Our platform is built for transparency, speed, and success—empowering professionals to streamline workflows, grow networks, and build trustworthy partnerships in the world of real estate.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          viewport={{ once: true }}
          className="text-sm text-gray-500 dark:text-gray-400 italic mt-6"
        >
          Built for the industry. Trusted by professionals.
        </motion.p>
      </motion.div>
    </section>
  );
};

export default About;
