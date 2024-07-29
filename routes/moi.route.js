import express from 'express';
import { getMois, getMoi, createMoi, updateMoi, deleteMoi } from '../controllers/moi.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import checkPermission from '../middlewares/checkPermission.js'
const router = express.Router();

router.get('/', isLoggedIn,  checkPermission('view_analytics') ,getMois);
router.get('/:id', isLoggedIn, checkPermission('view_analytics'), getMoi);
router.post('/', isLoggedIn, checkPermission('view_analytics'), createMoi);
router.put('/:id/edit', isLoggedIn, checkPermission('view_analytics'), updateMoi);
router.delete('/:id/delete', isLoggedIn, checkPermission('view_analytics'), deleteMoi);

export default router;