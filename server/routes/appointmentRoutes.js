// routes/appointmentRoutes.js
import express from 'express';
import { SaveAppointment, GetAppointmentAdmin,UpdateAppointmentAdmin } from '../controllers/appointmentController.js';

const router = express.Router();

// Middleware to log the received route
router.use((req, res, next) => {
  console.log(`Received request at route: ${req.originalUrl}`);
  next();
});

// Define the routes for appointment
router.post('/save', SaveAppointment);
router.post('/get', GetAppointmentAdmin);
router.put('/update/:id', UpdateAppointmentAdmin);

export default router;
