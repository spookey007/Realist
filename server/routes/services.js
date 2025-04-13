import express from 'express';
import * as servicesController from '../controllers/servicesController.js';

const router = express.Router();

// Get all services
router.get('/', servicesController.getAllServices);

// Get services grouped by type
router.get('/grouped', servicesController.getAllServicesGroupedByType);

// Get services by category
router.get('/by-category/:categoryId', servicesController.getServicesByCategory);

// Get a single service
router.get('/:serviceId', servicesController.getServiceById);

// Create a new service
router.post('/', servicesController.createService);

// Update a service
router.put('/:serviceId', servicesController.updateService);

// Delete a service
router.delete('/:serviceId', servicesController.deleteService);

// Get services with type
router.get('/with-type', servicesController.getServicesWithType);

export default router; 