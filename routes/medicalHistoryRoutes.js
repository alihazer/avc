import express from 'express';
import { getMedicalHistories, getMedicalHistory, createMedicalHistory, deleteMedicalHistory } from '../controllers/medicalHistory.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import checkPermission from '../middlewares/checkPermission.js';

const router = express.Router();

router.get('/', isLoggedIn, checkPermission('view_analytics') ,getMedicalHistories);
router.get('/:id', isLoggedIn, checkPermission('view_analytics') ,getMedicalHistory);
router.post('/', isLoggedIn, checkPermission('view_analytics') ,createMedicalHistory);
router.delete('/:id/delete', isLoggedIn, checkPermission('view_analytics') ,deleteMedicalHistory);

export default router;