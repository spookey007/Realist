import express from 'express';
import { setUserPermissions, getUserPermissions } from '../controllers/userPermissionsController.js';

const router = express.Router();

// User permissions routes
router.post('/', setUserPermissions);         // Route for creating or updating user permissions
router.get('/:userId', getUserPermissions);   // Route for retrieving permissions for a specific user

export default router;
