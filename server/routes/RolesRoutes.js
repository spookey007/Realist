import express from 'express';
import {
    createRole,
    updateRole,
    getAllRoles,
    getRoleById,
    deleteRole
} from '../controllers/rolesController.js';

const router = express.Router();

// Role routes
router.get('/getRoles', getAllRoles);          // Retrieve all roles
router.get('/:id', getRoleById);      // Retrieve a specific role by ID
router.post('/createRoles', createRole);          // Create a new role
router.put('/:id', updateRole);       // Update an existing role by ID
router.delete('/:id', deleteRole);    // Delete a role by ID

export default router;
