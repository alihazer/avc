import express from 'express';
import { getSurgicalHistories, getSurgicalHistory, createSurgicalHistory, deleteSurgicalHistory } from '../controllers/surgicalHistory.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import checkPermission from '../middlewares/checkPermission.js';

const router = express.Router();

router.get('/', isLoggedIn, checkPermission('view_analytics') ,getSurgicalHistories);
router.get('/:id', isLoggedIn, checkPermission('view_analytics') ,getSurgicalHistory);
router.post('/', isLoggedIn, checkPermission('view_analytics') ,createSurgicalHistory);
router.delete('/:id/delete', isLoggedIn, checkPermission('view_analytics') ,deleteSurgicalHistory);


export default router;