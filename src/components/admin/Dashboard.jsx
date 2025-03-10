import React from "react";
import { motion } from "framer-motion";

const dashboardData = [
  { title: "Products Sold", value: "4,565", color: "bg-purple-500" },
  { title: "Net Profit", value: "$8,541", color: "bg-red-500" },
  { title: "New Customers", value: "4,565", color: "bg-yellow-500" },
  { title: "Customer Satisfaction", value: "99%", color: "bg-blue-500" },
];

const Dashboard = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { staggerChildren: 0.2, duration: 0.5 },
        },
      }}
    >
      {dashboardData.map(({ title, value, color }) => (
        <motion.div
          key={title}
          className={`p-6 rounded-lg shadow-lg ${color} text-white`}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default Dashboard;