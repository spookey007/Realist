import express from 'express';
import {
    createRole,
    updateRole,
    getAllRoles,
    getRoleById,
    deleteRole
} from '../controllers/roleController.js';

const router = express.Router();

// Role routes
router.get('/roles', getAllRoles);          // Retrieve all roles
router.get('/roles/:id', getRoleById);      // Retrieve a specific role by ID
router.post('/roles', createRole);          // Create a new role
router.put('/roles/:id', updateRole);       // Update an existing role by ID
router.delete('/roles/:id', deleteRole);    // Delete a role by ID

export default router;
