import express from 'express';
import { createUser, updateUser, getAllUsers, getUserById } from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/', createUser);               // Create a new user
router.put('/:id', updateUser);              // Update user details by ID
router.get('/', getAllUsers);                // Get all users
router.get('/:id', getUserById);             // Get a user by ID

export default router;
