import asyncHandler from "express-async-handler";
import getLayoutName from "../utils/getLayoutName.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import moment from "moment";
import Cost from "../models/Cost.js";

// @desc getTheForm

const renderCostForm = asyncHandler(async (req, res) => {
    const layout = getLayoutName(req);
    const cars = await Car.find({ user: req.user._id });
    const users = await User.find();
    res.render("carCostForm", { layout, cars, users });
});

const createCost = asyncHandler(async (req, res) => {
    try {
        const { carId, cost, currency, date, cause, paidFor, person, note } = req.body;
        const car = await Car.find({number: carId});
        const newCost = new Cost({
            carId: car._id,
            cost: cost,
            currency,
            date,
            cause,
            paidFor,
            person,
            note,
        });
        await newCost.save();
        res.redirect("/cars/costs/all");
    } catch (error) {
        console.log(error);
        throw new Error("Error in creating cost");
    }
});

const getAllCosts = asyncHandler(async (req, res) => {
    const costs = await Cost.find().populate("carId").populate("person");
    const layout = getLayoutName(req);
    res.render("allCarCosts", { layout, carCosts: costs, moment });
});

const getCostById = asyncHandler(async (req, res) => {
    const cost = await CarCost.findById(req.params.id).populate("car").populate("person");
    const layout = getLayoutName(req);
    res.render("carCost", { layout, cost });
});

const getCostByCar = asyncHandler(async (id) => {
    const usdCosts = await CarCost.find({ carId: id, currency: "usd" });
    const lbpCosts = await CarCost.find({ carId: id, currency: "lbp" });

    const costs =  { usdCosts, lbpCosts };
    const usdTotal = usdCosts.reduce((acc, cost) => acc + cost.cost, 0);
    const lbpTotal = lbpCosts.reduce((acc, cost) => acc + cost.cost, 0);

    return { costs, usdTotal, lbpTotal };
});

export { renderCostForm, createCost, getAllCosts, getCostById, getCostByCar };