import express from 'express';
import {
  getAllInspectionReports,
  getInspectionReportById,
  createInspectionReport,
  updateInspectionReport,
  deleteInspectionReport,
} from '../controllers/propertyInspectionController.js';

const router = express.Router();

// Retrieve all property inspection reports
router.get('/', getAllInspectionReports);

// Retrieve a specific property inspection report by ID
router.get('/:reportId', getInspectionReportById);

// Create a new property inspection report
router.post('/', createInspectionReport);

// Update an existing property inspection report by ID
router.put('/:reportId', updateInspectionReport);

// Delete a property inspection report by ID
router.delete('/:reportId', deleteInspectionReport);

export default router;
