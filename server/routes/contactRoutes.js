// routes/contactRoutes.js
import express from 'express';
import { contactController } from '../controllers/contactController.js';

const router = express.Router();

// Define the route for contact
router.post('/', contactController);

export default router;
