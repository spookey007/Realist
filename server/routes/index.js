import express from 'express';
import contactRoutes from './contactRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import userRoutes from './userRoutes.js';
import userPermissionsRoutes from './userPermissionsRoutes.js';

const router = express.Router();

// Use the imported routes
router.use('/contact', contactRoutes);
router.use('/appointment', appointmentRoutes);
router.use('/users', userRoutes);
router.use('/user-permissions', userPermissionsRoutes);

export default router;
