import express from 'express';
import {
  getAllPropertyMedia,
  getPropertyMediaById,
  uploadPropertyMedia,
  updatePropertyMedia,
  deletePropertyMedia,
} from '../controllers/propertyMediaController.js';

const router = express.Router();

// Retrieve all property media
router.get('/', getAllPropertyMedia);

// Retrieve a specific property media by ID
router.get('/:mediaId', getPropertyMediaById);

// Upload new property media
router.post('/', uploadPropertyMedia);

// Update an existing property media by ID
router.put('/:mediaId', updatePropertyMedia);

// Delete property media by ID
router.delete('/:mediaId', deletePropertyMedia);

export default router;
