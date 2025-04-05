import express from "express";
import {
  createUserA,
  createUserB,
  updateUser,
  getAllUsers,
  getUserById,
  deleteUser,
  loginUser,
  RegisterContractor,
  registerRea,
  clerkAuth,
//   changeUserStatus,
//   resetPassword,
} from "../controllers/userController.js";

const router = express.Router();

// User Authentication
router.post("/login", loginUser); // Authenticate user and return token

router.post("/clerk-auth", clerkAuth); // Authenticate user and return token

// User Management
router.get("/", getAllUsers); // Retrieve all users
router.get("/:id", getUserById); // Retrieve a specific user by ID
router.post("/", createUserA); // Create a new user
router.post("/registerContractor", RegisterContractor); // Create a new user
router.post("/registerRea", registerRea); // Create a new user
router.post("/admin", createUserB); // Create a new user Admin
router.put("/update/:id", updateUser); // Update user details directly
router.delete("/:id", deleteUser); // Delete a user by ID

// Additional Routes
// router.put("/status/:id", changeUserStatus); // Activate/Deactivate users
// router.put("/reset-password/:id", resetPassword); // Reset user password

export default router;
