import express from 'express';
import { getLogs } from '../controllers/log.controller.js';
import isLoggedIn from '../middlewares/isLoggedIn.js';
import checkPermission from '../middlewares/checkPermission.js';

const router = express.Router();
router.get('/:id', isLoggedIn, getLogs);

export default router;