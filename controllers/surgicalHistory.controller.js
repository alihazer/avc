import SurgicalHistory from "../models/SurgicalHistory.js";
import asyncHandler from "express-async-handler";

// @desc    Fetch all surgical histories
// @route   GET /api/surgical-histories
// @access  Public
const getSurgicalHistories = asyncHandler(async (req, res) => {
  try {
    const surgicalHistories = await SurgicalHistory.find({});
    res.status(200).render("allSurgicalHistories", { surgicalHistories });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .render("error", { message: "An error occurred, please try again later" });
  }
});

// @desc    Fetch single surgical history
// @route   GET /api/surgical-histories/:id
// @access  Public

const getSurgicalHistory = asyncHandler(async (req, res) => {
    try {
        const surgicalHistory = await SurgicalHistory.findById(req.params.id);
        if (!surgicalHistory) {
        res.status(404).render("error", { message: "Surgical history not found" });
        }
        res.status(200).render("surgicalHistory", { surgicalHistory });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .render("error", { message: "An error occurred, please try again later" });
    }
});

// @desc    Create a surgical history
// @route   POST /api/surgical-histories
// @access  Private/Admin

const createSurgicalHistory = asyncHandler(async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).render("error", { message: "Name is required" });
        }
        const surgicalHistory = await SurgicalHistory.create({ name });
        return res.status(201).redirect("/surgical-histories");
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .render("error", { message: "An error occurred, please try again later" });
    }
});

// @desc delete a surgical history
// @route DELETE /api/surgical-histories/:id/delete
// @access Private/Admin

const deleteSurgicalHistory = asyncHandler(async (req, res) => {
    try {
        const surgicalHistory = await SurgicalHistory.findById(req.params.id);
        if (!surgicalHistory) {
        return res.status(404).render("error", { message: "Surgical history not found" });
        }
        await SurgicalHistory.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            status: true,
            message: "Surgical history deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .render("error", { message: "An error occurred, please try again later" });
    }
});


export { getSurgicalHistories, getSurgicalHistory, createSurgicalHistory, deleteSurgicalHistory };
