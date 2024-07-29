import Moi from '../models/Moi.js';
import asyncHandler from 'express-async-handler';


// @desc    Fetch all mois
// @route   GET /api/mois
// @access  Public
const getMois = asyncHandler(async (req, res) => {
  try {
    const mois = await Moi.find({});
    res.status(200).render('allMois', {mois})
  } catch (error) {
    console.log(error);
    res.status(500).render('error', {message: 'An error occurred, please try again later'});
  }
});

// @desc    Fetch single moi
// @route   GET /api/mois/:id
// @access  Public

const getMoi = asyncHandler(async (req, res) => {
    try {
        const moi = await Moi.findById(req.params.id);
        if(!moi){
        res.status(404).render('error', {message: 'Moi not found'});
        }
        res.status(200).render('moi', {moi});
    } catch (error) {
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

// @desc    Create a moi
// @route   POST /api/mois
// @access  Private/Admin

const createMoi = asyncHandler(async (req, res) => {
    try{
        const { name } = req.body;
        if(!name){
            res.status(400).render('error', {message: 'Name is required'});
        }
        const moi = await Moi.create({name});
        res.status(201).redirect('/moi');
    }catch(error){
        console.log(error);
        res.status(500).render('error', {message: 'An error occurred, please try again later'});
    }
});

// @desc    Update a moi
// @route   PUT /api/mois/:id/edit
// @access  Private/Admin
const updateMoi = asyncHandler(async (req, res) => {
    try{
        const moi = await Moi.findById(req.params.id);
        if(!moi){
            res.status(404).json({message: 'Moi not found'});
        }
        const { name } = req.body;
        if(!name){
            res.status(400).json({message: 'Name is required'});
        }
        moi.name = name;
        await moi.save();
        res.status(200).json({moi});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred, please try again later'});
    }
});

// @desc    Delete a moi
// @route   DELETE /api/mois/:id
// @access  Private/Admin

const deleteMoi = asyncHandler(async (req, res) => {
    try{
        const moi = await Moi.findById(req.params.id);
        if(!moi){
            res.status(404).json({message: 'Moi not found'});
        }
        await Moi.deleteOne({_id: req.params.id});
        res.status(200).json({message: 'Moi deleted'});
    }catch(error){
        console.log(error);
        res.status(500).json({message: 'An error occurred, please try again later'});
    }
});

export { getMois, getMoi, createMoi, updateMoi, deleteMoi };





