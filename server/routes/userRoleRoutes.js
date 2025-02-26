import express from 'express';
import {
    createUserRole,
    updateUserRole,
    getAllUserRoles,
    getUserRoleById,
    deleteUserRole
} from '../controllers/userRoleController.js';

const router = express.Router();

// User Role routes
router.get('/user-roles', getAllUserRoles);          // Retrieve all user-role associations
router.get('/user-roles/:id', getUserRoleById);      // Retrieve a specific user-role association
router.post('/user-roles', createUserRole);          // Create a new user-role association
router.put('/user-roles/:id', updateUserRole);       // Update a user-role association
router.delete('/user-roles/:id', deleteUserRole);    // Delete a user-role association

export default router;
