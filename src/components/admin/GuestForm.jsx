import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext"; // Assuming this context gives the logged-in user
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import RegisterModal from "../RegisterModal"; // For Real Estate Agent Registration
import Invite from "../Invite"; // For Contractor Registration

const GuestForm = () => {
  const { user } = useAuth(); // Assuming this context gives the logged-in user
  const navigate = useNavigate();
  const [userType, setUserType] = useState('real_estate'); // Track the selected user type
  const [inviteCode, setInviteCode] = useState('');
  const [isInviteValid, setIsInviteValid] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRModalOpen, setIsRModalOpen] = useState(false); // Initially show Register Modal on page load
  const [isModalBOpen, setisModalBOpen] = useState(true);


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
  const closeRModal = () => setIsRModalOpen(false);

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

  const handleInviteCodeChange = (event) => {
    setInviteCode(event.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Close the current modal when submit is clicked
    closeRModal();

    if (userType === 'contractor' && !inviteCode) {
      alertify.error("Invite code is required for contractors.");
    } else {
      if (userType === 'contractor' && inviteCode) {
        // Validate invite code for contractors
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/invites/${inviteCode}`);
          const data = await response.json();

          if (response.ok) {
            setisModalBOpen(false);
            setIsInviteValid(true);
            setIsInviteModalOpen(true);
            console.log(isInviteModalOpen)
            console.log(isInviteValid)
            console.log(isRModalOpen)
          } else {
            alertify.error("Invalid invite code.");
            setIsInviteValid(false);
          }
        } catch (error) {
          console.error(error);
          alertify.error("Error validating invite code.");
        }
      } else {
        setIsInviteModalOpen(false);
        setIsInviteValid(true);
        setisModalBOpen(false);
        console.log(isInviteModalOpen)
        console.log(isInviteValid)
        console.log(isRModalOpen)
        // Skip invite validation for real estate agent and open Register modal
         // Close Invite modal (if it was open)
        openRModal(); // Open Register Modal for Real Estate Agent
      }
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
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }} // smooth ease-out effect
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="bg-gray-200 rounded-2xl shadow-2xl p-8 w-full max-w-md modal-content"
          >
            <button className="absolute top-4 right-4 text-xl font-semibold" onClick={closeRModal}>
              &times;
            </button>
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
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Submit
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Conditionally show the Invite modal or Register modal */}
    {isInviteModalOpen && isInviteValid && (
        <Invite id={inviteCode} existingUser={user} />
      )}
      
      {/* Show Register Modal for Real Estate Agent if no valid invite code */}
      {!isInviteModalOpen && isInviteValid && (
        <RegisterModal
          isOpen={true}
          closeModal={() => {}}
          existingUser={user}
        />
      )}
      </>
  );
};

export default GuestForm;
