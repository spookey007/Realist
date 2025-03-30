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
router.get('/', getAllServices);

// GET /services/:serviceId - Retrieve a specific service by ID
router.get('/:serviceId', getServiceById);

// POST /services - Create a new service
router.post('/', createService);

// PUT /services/:serviceId - Update a service by ID
router.put('/:serviceId', updateService);

// DELETE /services/:serviceId - Delete a service by ID
router.delete('/:serviceId', deleteService);

export default router;
