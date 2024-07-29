import MedicalHistory from "../models/MedicalHistory.js";
import asyncHandler from 'express-async-handler';

// @desc    Fetch all medical histories
// @route   GET /api/medical-histories
// @access  Public

const getMedicalHistories = asyncHandler(async (req, res) => {
    try {
        const medicalHistories = await MedicalHistory.find({});
        res.status(200).render('allMedicalHistories', {medicalHistories})
    } catch (error) {
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

// @desc    Fetch single medical history
// @route   GET /api/medical-histories/:id
// @access  Public

const getMedicalHistory = asyncHandler(async (req, res) => {
    try {
        const medicalHistory = await MedicalHistory.findById(req.params.id);
        if(!medicalHistory){
            res.status(404).render('error', {message: 'Medical history not found'});
        }
        res.status(200).render('medicalHistory', {medicalHistory});
    } catch (error) {
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

// @desc    Create a medical history
// @route   POST /api/medical-histories
// @access  Private/Admin

const createMedicalHistory = asyncHandler(async (req, res) => {
    try{
        const { name } = req.body;
        if(!name){
            res.status(400).render('error', {message: 'Name is required'});
        }
        const medicalHistory = await MedicalHistory.create({name});
        res.status(201).redirect('/medical-histories');
    }catch(error){
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

// @desc delete a medical history
// @route DELETE /api/medical-histories/:id/delete
// @access Private/Admin

const deleteMedicalHistory = asyncHandler(async (req, res) => {
    try{
        const medicalHistory = await MedicalHistory.findById(req.params.id);
        if(!medicalHistory){
            res.status(404).render('error', {message: 'Medical history not found'});
        }
        const deletedMedicalHistory = await MedicalHistory.findByIdAndDelete(req.params.id);
        if(!deletedMedicalHistory){
            return res.status(500).render('error', {message: 'An error occurred, please try again later'});
        }
        return res.status(200).json({status: true, message: 'Medical history deleted successfully'});
    }catch(error){
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

export { getMedicalHistories, getMedicalHistory, createMedicalHistory, deleteMedicalHistory };
