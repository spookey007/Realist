import express from 'express';
import {
  getAllServiceTypes,
  getServiceTypeById,
  createServiceType,
  updateServiceType,
  deleteServiceType
} from '../controllers/serviceTypesController.js';

const router = express.Router();

// GET /servicestypes - Retrieve all service types
router.get('/', getAllServiceTypes);

// GET /servicestypes/:serviceTypeId - Retrieve a specific service type by ID
router.get('/:serviceTypeId', getServiceTypeById);

// POST /servicestypes - Create a new service type
router.post('/', createServiceType);

// PUT /servicestypes/:serviceTypeId - Update a service type by ID
router.put('/:serviceTypeId', updateServiceType);

// DELETE /servicestypes/:serviceTypeId - Delete a service type by ID
router.delete('/:serviceTypeId', deleteServiceType);

export default router;
