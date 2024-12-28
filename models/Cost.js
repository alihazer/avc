import mongoose from "mongoose";

const CarCostSchema = new mongoose.Schema({
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true,
    },
    cost: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
        enum: ['usd', 'lbp']
    },
    date: {
        type: Date,
        required: true,
    },
    cause:{
        type: String,
        required: true,
        enum: ['maintenance', 'benzine', 'oilchange']
    },
    speedoMeterValue:{
        type: Number,
    },
    litersCount:{
        type: Number
    },
    paidFor:{
        type: String,
        required: true,
    },
    person:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    note:{
        type: String,
    }
});

const Cost = mongoose.model("CarCost", CarCostSchema);
export default Cost;
