import express from 'express';
import {
    createUser,
    updateUser,
    getAllUsers,
    getUserById,
    deleteUser,
    loginUser
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.get('', getAllUsers);           // Retrieve all users
router.get('/:id', getUserById);       // Retrieve a specific user by ID
router.post('', createUser);           // Create a new user
router.put('/:id', updateUser);        // Update an existing user by ID
router.delete('/:id', deleteUser);     // Delete a user by ID
router.post('/login', loginUser);      // Authenticate user and return token

export default router;
