import express from 'express';
import {
  getAllServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType
} from '../controllers/serviceTypesController.js';

const router = express.Router();

// GET /service-types - Retrieve all service types
router.get('/service-types', getAllServiceTypes);

// GET /service-types/:serviceTypeId - Retrieve a specific service type by ID
router.get('/service-types/:serviceTypeId', getServiceTypeById);

// POST /service-types - Create a new service type
router.post('/service-types', createServiceType);

// PUT /service-types/:serviceTypeId - Update a service type by ID
router.put('/service-types/:serviceTypeId', updateServiceType);

// DELETE /service-types/:serviceTypeId - Delete a service type by ID
router.delete('/service-types/:serviceTypeId', deleteServiceType);

export default router;
