import express from "express";
import { validateLicense } from '../controllers/externalApiController.js';

const router = express.Router();

// valuddate license
router.post("/validate-license", validateLicense);

export default router;
