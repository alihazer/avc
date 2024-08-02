import {renderFirstForm, createEmergencyTriage, getLoggedInUserTriages, getThisMonthsTriages, generatePdf, getTriage, renderEditTriage, editTriage, getTriageWithPagination } from "../controllers/triage.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import checkPermission from "../middlewares/checkPermission.js";
import express from "express";
const router = express.Router();

router.get('/create', isLoggedIn, checkPermission('create_triage'), renderFirstForm);
router.post('/emergency', isLoggedIn, checkPermission('create_triage'), createEmergencyTriage);
router.get('/get', isLoggedIn, checkPermission('create_triage'),getLoggedInUserTriages );
router.get('/get/this-month', isLoggedIn, checkPermission('create_triage'), getThisMonthsTriages);
router.get('/generate-pdf/:id', isLoggedIn, checkPermission('create_triage'), getTriage);
router.get('/get/:id', isLoggedIn, checkPermission('create_triage'), getTriage);
router.get('/edit/:id', isLoggedIn, checkPermission('create_triage'), renderEditTriage);
router.put('/edit/:id', isLoggedIn, checkPermission('create_triage'), editTriage);
router.get('/all', isLoggedIn, checkPermission('view_analytics'), getTriageWithPagination);

export default router;