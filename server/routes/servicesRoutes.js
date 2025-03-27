import express from 'express';
import {
    createService,
    getAllServices,
    getServiceById,
    updateService,
    deleteService
} from '../controllers/servicesController.js';

const router = express.Router();

// GET /services - Retrieve all services
router.get('/services', getAllServices);

// GET /services/:serviceId - Retrieve a specific service by ID
router.get('/services/:serviceId', getServiceById);

// POST /services - Create a new service
router.post('/services', createService);

// PUT /services/:serviceId - Update a service by ID
router.put('/services/:serviceId', updateService);

// DELETE /services/:serviceId - Delete a service by ID
router.delete('/services/:serviceId', deleteService);

export default router;
