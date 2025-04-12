import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion,AnimatePresence } from "framer-motion";
import GuestForm from "./GuestForm"; 
import { useAuth } from '../../context/AuthContext';
const dashboardData = [
  { title: "Products Sold", value: "4,565", color: "bg-purple-500" },
  { title: "Net Profit", value: "$8,541", color: "bg-red-500" },
  { title: "New Customers", value: "4,565", color: "bg-yellow-500" },
  { title: "Customer Satisfaction", value: "99%", color: "bg-blue-500" },
];

  // Check if the user has no menu rights and role is 0 (guest)

  

const Dashboard = () => {
  const { user, menu } = useAuth();
  const [isGuestFormOpen, setIsGuestFormOpen] = useState(false);
  const [isDialogOpen, setisDialogOpen] = useState(true);

  
  const handleCloseDialog = () => {
    setIsGuestFormOpen(true)
    setisDialogOpen(false);
  };

  const handleBackDialog = () => {
    setIsGuestFormOpen(false)
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
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smoother easeOutExpo
            className="bg-white/10 backdrop-blur-sm fixed inset-0 z-50 flex items-center justify-center bg-black/50" // darker backdrop
          >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-500/20  rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[100vh] overflow-y-auto modal-content"
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
      <GuestForm
        isGuestFormOpen={isGuestFormOpen}
        isGuestFormClosed={() => setIsGuestFormOpen(false)}
        isGuestFormBack={handleBackDialog}
      />
</AnimatePresence>



      </>
    );
  }
  
  
  
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