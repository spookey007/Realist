import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming this context gives the logged-in user
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RegisterModal from "../RegisterModal"; // For Real Estate Agent Registration
import Invite from "../Invite"; // For Contractor Registration

const GuestForm = ({ isGuestFormOpen, isGuestFormClosed, isGuestFormBack }) => {

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth(); // Assuming this context gives the logged-in user
  const navigate = useNavigate();
  const [userType, setUserType] = useState('real_estate'); // Track the selected user type
  const [inviteCode, setInviteCode] = useState('');
  const [isInviteValid, setIsInviteValid] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRModalOpen, setIsRModalOpen] = useState(false); // Initially show Register Modal on page load
  const [isModalBOpen, setisModalBOpen] = useState(isGuestFormOpen);

  const handleBackDialog = () => {
    setisModalBOpen(true)
    setIsInviteModalOpen(true);
    setIsInviteValid(false);      
  };

  useEffect(() => {
    setisModalBOpen(isGuestFormOpen);
  }, [isGuestFormOpen]);

  // Set the modal state to true when the page is loaded
  useEffect(() => {
    if (user) {
      setInviteCode('');
      setIsInviteValid(false);
    }
  }, [user]);

  // Function to open the Register Modal
  const openRModal = () => setIsRModalOpen(true);

  // Function to close the Register Modal
  const closeBModal = () => {
    setisModalBOpen(false);
    if (isGuestFormClosed) isGuestFormClosed();
  };

  // Handle role selection (Real Estate or Contractor)
  const handleUserTypeChange = (event) => {
    setUserType(event.target.value); // Update user type selection
    setIsInviteModalOpen(false);  // Close any modal on role change
    setIsInviteValid(false);      // Reset invite validity state

    // Show Register Modal for Real Estate Agent if user switches to Real Estate
    if (event.target.value === 'real_estate') {
      openRModal(); // Open Register Modal for Real Estate
    }
  };

  const handleCloseInviteModal = () => {
    setIsInviteModalOpen(false);
    setIsRModalOpen(false);
  };
  

  const handleInviteCodeChange = (event) => {
    setInviteCode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start loading
  
    try {
      if (userType === 'contractor' && !inviteCode) {
        alertify.error("Invite code is required for contractors.");
        return;
      }
  
      if (userType === 'contractor' && inviteCode) {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invites/${inviteCode}`);
        const data = await response.json();
  
        if (response.ok) {
          setisModalBOpen(false);
          setIsInviteValid(true);
          setIsInviteModalOpen(true);
          closeBModal();
        } else {
          alertify.error("Invalid invite code.");
          setIsInviteValid(false);
        }
      } else {
        setIsInviteModalOpen(false);
        setIsInviteValid(true);
        setisModalBOpen(false);
        closeBModal();
        openRModal();
      }
    } catch (error) {
      console.error(error);
      alertify.error("Error validating invite code.");
    } finally {
      setIsSubmitting(false); // Stop loading regardless of outcome
    }
  };
  

  return (
    <>
    <AnimatePresence>
      {isModalBOpen && (
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
            <h2 className="text-2xl font-semibold text-center p-2">Complete your registration</h2>

            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label htmlFor="userType" className="block text-center text-lg font-medium text-gray-700 p-2">Register as:</label>
                <select
                  id="userType"
                  name="userType"
                  value={userType}
                  onChange={handleUserTypeChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="real_estate">Real Estate Agent</option>
                  <option value="contractor">Contractor</option>
                </select>
              </div>

              {/* Show Invite Code field only for Contractors */}
              <div className="h-16">
                <AnimatePresence>
                  {userType === 'contractor' && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}  // Start from above with no opacity
                      animate={{ opacity: 1, y: 0 }}     // Fade in and slide into place
                      exit={{ opacity: 0, y: -20 }}       // Fade out and slide down
                      transition={{ opacity: { duration: 0.5 }, y: { duration: 0.5 } }} // Smooth transition for both opacity and y
                    >
                      <label htmlFor="inviteCode" className="block text-sm font-medium text-gray-700">
                        Invite Code:
                      </label>
                      <input
                        type="text"
                        id="inviteCode"
                        name="inviteCode"
                        value={inviteCode}
                        onChange={handleInviteCodeChange}
                        placeholder="Enter Invite Code"
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div>
              <div className="flex justify-between mt-4">
              <button
                onClick={isGuestFormBack}
                disabled={isSubmitting}
                className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                  ${
                    isSubmitting
                      ? "bg-gray-200 text-gray-500 cursor-not-allowed border-gray-300"
                      : "bg-white/30 text-black border-white/20"
                  }
                  [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`group relative inline-flex h-10 items-center justify-center overflow-hidden rounded-md border px-6 font-medium transition-all duration-100
                    ${
                      isSubmitting
                        ? "border-neutral-200 bg-blue-600/60 px-6 font-medium text-white transition-all duration-100 cursor-not-allowed"
                        : "border-neutral-200 bg-blue-600 px-6 font-medium text-white transition-all duration-100 hover:bg-blue-700"
                    }
                    [box-shadow:5px_5px_rgb(82_82_82)] active:translate-x-[3px] active:translate-y-[3px] active:[box-shadow:0px_0px_rgb(82_82_82)]`}
                >
                  {isSubmitting ? (
                    <>
                      <svg 
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                        xmlns="http://www.w3.org/2000/svg" 
                        fill="none" 
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Submit'
                  )}
                </button>
                  </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Conditionally show the Invite modal or Register modal */}
    {isInviteModalOpen && isInviteValid && (
        <Invite 
        id={inviteCode} 
        existingUser={user} 
        isOpen={isRModalOpen}
        closeModal={handleCloseInviteModal}
        onBack={handleBackDialog} 
        />
      )}
      
      {/* Show Register Modal for Real Estate Agent if no valid invite code */}
      {!isInviteModalOpen && isInviteValid && (
        <RegisterModal
          isOpen={isRModalOpen}
          closeModal={() => setIsRModalOpen(false)}
          onBack={handleBackDialog} 
          existingUser={user}
        />
      )}
      </>
  );
};

export default GuestForm;
