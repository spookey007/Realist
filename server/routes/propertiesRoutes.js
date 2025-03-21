import express from 'express';
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from '../controllers/propertiesController.js';

const router = express.Router();

// Retrieve all properties
router.get('/', getAllProperties);

// Retrieve a specific property by ID
router.get('/:propertyId', getPropertyById);

// Create a new property
router.post('/', createProperty);

// Update an existing property by ID
router.put('/:propertyId', updateProperty);

// Delete a property by ID
router.delete('/:propertyId', deleteProperty);

export default router;
