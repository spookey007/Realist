// src/pages/Dashboard.jsx
import React from "react";

const dashboardData = [
  { title: "Products Sold", value: "4,565", color: "bg-purple-500" },
  { title: "Net Profit", value: "$8,541", color: "bg-red-500" },
  { title: "New Customers", value: "4,565", color: "bg-yellow-500" },
  { title: "Customer Satisfaction", value: "99%", color: "bg-blue-500" },
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {dashboardData.map(({ title, value, color }) => (
        <div key={title} className={`p-6 rounded-lg shadow-lg ${color} text-white`}>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
