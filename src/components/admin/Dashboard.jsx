import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import GuestForm from "./GuestForm";
import { useAuth } from '../../context/AuthContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Dummy data for charts
const salesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Property Sales',
      data: [12, 19, 15, 25, 22, 30],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
      tension: 0.4
    }
  ]
};

const propertyTypesData = {
  labels: ['Residential', 'Commercial', 'Land', 'Industrial'],
  datasets: [
    {
      data: [45, 25, 20, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ]
    }
  ]
};

const performanceData = {
  labels: ['Q1', 'Q2', 'Q3', 'Q4'],
  datasets: [
    {
      label: 'Revenue',
      data: [45000, 52000, 48000, 60000],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    },
    {
      label: 'Expenses',
      data: [30000, 35000, 32000, 40000],
      backgroundColor: 'rgba(239, 68, 68, 0.5)',
    }
  ]
};

// Dummy data for cards
const statsData = [
  { title: "Total Properties", value: "1,234", change: "+12%", color: "bg-blue-500" },
  { title: "Active Listings", value: "456", change: "+8%", color: "bg-green-500" },
  { title: "Pending Sales", value: "89", change: "+5%", color: "bg-yellow-500" },
  { title: "Closed Deals", value: "678", change: "+15%", color: "bg-purple-500" }
];

const invitedMembers = [
  { name: "John Smith", email: "john@example.com", status: "Pending", date: "2024-03-15" },
  { name: "Sarah Johnson", email: "sarah@example.com", status: "Accepted", date: "2024-03-14" },
  { name: "Michael Brown", email: "michael@example.com", status: "Pending", date: "2024-03-13" },
  { name: "Emily Davis", email: "emily@example.com", status: "Accepted", date: "2024-03-12" }
];

const recentActivities = [
  { type: "New Listing", description: "Added 3-bedroom apartment in Downtown", time: "2 hours ago" },
  { type: "Property Update", description: "Updated pricing for Commercial Plaza", time: "4 hours ago" },
  { type: "Document Upload", description: "Added new property documents", time: "6 hours ago" },
  { type: "Meeting Scheduled", description: "Client meeting for property viewing", time: "1 day ago" }
];

const Dashboard = () => {
  const { user, menu } = useAuth();
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(true);

  const handleCloseDialog = () => {
    setIsGuestFormOpen(true);
    setisDialogOpen(false);
  };

  const handleBackDialog = () => {
    setIsGuestFormOpen(false);
    setisDialogOpen(true);
  };

  if (user && Array.isArray(menu) && user.role === 0) {
    return (
      <>
        <AnimatePresence>
          {isDialogOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            >
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gray-500/20 rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[100vh] overflow-y-auto modal-content"
              >
                <div className="flex flex-col items-center text-center space-y-6">
                  <div className="text-5xl text-blue-600 mb-2">
                    <span role="img" aria-label="Lock icon" aria-hidden="false">
                      🔒
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Restricted Access
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                      This content requires a registered account. Please complete your registration to access all portal features.
                    </p>
                  </div>

                  <div className="w-full space-y-3">
                    <button
                      onClick={handleCloseDialog}
                      className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                    >
                      Complete Registration
                    </button>
                    
                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-gray-300"></div>
                      <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                      <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    
                    <Link
                      to="/services"
                      className="group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100 bg-white/30 text-black  border-white/20 [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]"
                    >
                      Browse Available Services
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <GuestForm
          isGuestFormOpen={isGuestFormOpen}
          isGuestFormClosed={() => setIsGuestFormOpen(false)}
          isGuestFormBack={handleBackDialog}
        />
      </>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${stat.color} rounded-xl p-6 text-white shadow-lg`}
          >
            <h3 className="text-sm font-medium mb-1">{stat.title}</h3>
            <div className="flex items-baseline justify-between">
              <p className="text-2xl font-bold">{stat.value}</p>
              <span className="text-sm bg-white/20 px-2 py-1 rounded-full">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Sales Trend</h3>
          <Line data={salesData} options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              }
            }
          }} />
        </motion.div>

        {/* Property Types Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Property Types Distribution</h3>
          <div className="h-64">
            <Doughnut data={propertyTypesData} options={{
              responsive: true,
              maintainAspectRatio: false
            }} />
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-lg font-semibold mb-4">Quarterly Performance</h3>
        <Bar data={performanceData} options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          }
        }} />
      </motion.div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invited Members */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Invited Members</h3>
          <div className="space-y-4">
            {invitedMembers.map((member, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{member.name}</p>
                  <p className="text-sm text-gray-500">{member.email}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    member.status === 'Accepted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {member.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{member.date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'New Listing' ? 'bg-blue-500' :
                  activity.type === 'Property Update' ? 'bg-green-500' :
                  activity.type === 'Document Upload' ? 'bg-yellow-500' : 'bg-purple-500'
                }`} />
                <div>
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-600">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;