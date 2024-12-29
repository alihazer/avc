import asyncHandler from "express-async-handler";
import getLayoutName from "../utils/getLayoutName.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import moment from "moment";
import Cost from "../models/Cost.js";
import mongoose from "mongoose";

// @desc getTheForm

const renderCostForm = asyncHandler(async (req, res) => {
    const layout = getLayoutName(req);
    const cars = await Car.find({ user: req.user._id });
    const users = await User.find();
    res.render("carCostForm", { layout, cars, users });
});

const createCost = asyncHandler(async (req, res) => {
    try {
        const { carId, cost, currency, date, cause, paidFor, person, note, speedoMeterValue, litersCount } = req.body;
        const car = await Car.findById(carId);
        const newCost = new Cost({
            carId: car._id,
            cost: cost,
            currency,
            date,
            cause,
            paidFor,
            person,
            note,
            speedoMeterValue,
            litersCount
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
    const usdCosts = await Cost.find({ carId: id, currency: "usd" });
    const lbpCosts = await Cost.find({ carId: id, currency: "lbp" });

    const costs =  { usdCosts, lbpCosts };
    const usdTotal = usdCosts.reduce((acc, cost) => acc + cost.cost, 0);
    const lbpTotal = lbpCosts.reduce((acc, cost) => acc + cost.cost, 0);

    return { costs, usdTotal, lbpTotal };
});

const getCarCostById = asyncHandler(async (req, res) => {
    const { carId, year } = req.params;

    try {
        const exchangeRate = 89000;  // 1 USD = 89000 LBP
        const start = new Date(`${year}-01-01`);
        const end = new Date(`${year}-12-31`);
        const costs = await Cost.aggregate([
            { $match: { carId: new mongoose.Types.ObjectId(carId), date: { $gte: start, $lte: end } } },
            {
                $group: {
                    _id: {
                        cause: "$cause",
                        month: { $month: "$date" }
                    },
                    totalCost: {
                        $sum: {
                            $cond: [
                                { $eq: ["$currency", "usd"] },
                                "$cost",  // No conversion needed if currency is USD
                                { $divide: ["$cost", exchangeRate] }  // Convert LBP to USD
                            ]
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$_id.cause",
                    data: {
                        $push: {
                            month: "$_id.month",
                            totalCost: { $round: ["$totalCost", 3] }  // Round to 3 decimal places
                        }
                    }
                }
            }
        ]);

        const totalCost = costs.reduce((acc, cost) => {
            return acc + cost.data.reduce((acc, data) => acc + data.totalCost, 0);
        }, 0);
        

        res.json({ costs, totalCost });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

export { renderCostForm, createCost, getAllCosts, getCostById, getCostByCar, getCarCostById };