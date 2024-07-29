import Car from "../models/Car.js";
import asyncHandler from "express-async-handler";
import Material from "../models/Material.js";
import CarLog from "../models/CarLog.js";
import moment from "moment";
import Triage from "../models/Triage.js";
import getLayoutName from "../utils/getLayoutName.js";


// Add new Car
// POST /api/cars
// Private/Admin

const addCar = asyncHandler(async (req, res) => {
    try {
        const { type, number } = req.body;
        // Validate request body
        if(!type || !number){
            res.status(400);
            res.render("addCar", {message: "All fields are required"});
        }
        // Make sure car number is unique
        const carExists = await Car.findOne({number});
        if(carExists){
            res.status(400);
            return res.render("addCar", {message: "Car number already exists"});
        }

        const car = await Car.create({type, number});

        return res.render("addCar", {message: "Car added successfully"});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

// Get add car form
// GET /api/cars/add
// Private/Admin

const getAddCarForm = asyncHandler(async (req, res) => {
    try {
        res.render("addCar", {message: ""});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

// Get all cars
// GET /api/cars
// Private/Admin

const getCars = asyncHandler(async (req, res) => {
    try {
        const cars = await Car.find();
        const layout = getLayoutName(req);
        res.render("allCars", {cars, layout});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

// Get car by id
// GET /api/cars/:id
// Private/Admin

const getCarById = asyncHandler(async (req, res) => {
    try {
        const car = await Car.findById(req.params.id).populate("materials._id").exec();
        const logs = await CarLog.find({carId: car._id})
                                    .sort({createdAt: -1})
                                    .limit(10)
                                    .populate({path: 'user', select: '-password'})
                                    .populate("materials_added._id")
                                    .exec();
        if(!car){
            res.status(404);
            throw new Error("Car not found");
        }
        return res.render("viewCar", {car, logs, moment});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

// Update car by id
// PUT /api/cars/:id
// Private/Admin

const updateCar = asyncHandler(async (req, res) => {
    try {
        const { type, materials } = req.body;
        const temp = materials;
        
        if(!type){
            res.status(400);
            return res.json({
                status: false,
                message: "All fields are required"
            });
        }
        const car = await Car.findById(req.params.id);
        if(!car){
            res.status(404);
            return res.json({
                status: false,
                message: "Car not found"
            });
        }
        car.type = type;

        
        for (const material of materials) {
            const material_details = await Material.findById(material._id);
            // Check if quantity of the material is enough
            if (material_details.quantity < material.quantity) {
                return res.json({
                    status: false,
                    message: `Quantity of material ${material_details.name} is not enough in the stock`
                });
            }
            // decrease quantity of the material
            material_details.quantity -= material.quantity;
            await material_details.save();
            
        }
        // Check if materials already exist in the car
        for (const material of materials) {
            const existingMaterial = car.materials.find(m => m._id.toString() === material._id);
            if (existingMaterial) {
                existingMaterial.quantity += parseInt(material.quantity);
            } else {
                car.materials.push(material);
            }
        }
        const updatedCar = await car.save();
        const log = await CarLog.create({
            action: "Added",
            carId: car._id,
            materials_added: temp,
            user: req.user.id
        });
        
        return res.json({
            status: true,
            message: "Car updated", car: updatedCar
        });
    } catch (error) {
        console.log(error);
        return res.json({
            status: false,
            message: error.message
        });
    
        
    }
});

// Delete car by id
// DELETE /api/cars/:id
// Private/Admin

const deleteCar = asyncHandler(async (req, res) => {
    const car = await Car.findById(req.params.id);
    if(!car){
        res.status(404);
        res.json(
            {
                status: false,
                message: "Car not found"
            }
        )
    }
    await Car.findByIdAndDelete(req.params.id);
    res.json({
        status: true,
        message: "Car removed"
    });
});

// get edit car form
// GET /api/cars/:id/edit

const getEditCarForm = asyncHandler(async (req, res) => {
    const layout = getLayoutName(req);
    try {
        const car = await Car.findById(req.params.id);
        const materials = await Material.find();
        if(!car){
            res.status(404);
            throw new Error("Car not found");
        }
        res.render("editCar", {car, materials, layout});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

const getMostCasesCar = asyncHandler(async(thisMonth = false)=>{
    if(!thisMonth){
        const cars = await Car.find();
        let maxCar = cars[0];
        for (const car of cars) {
            if(car.totalCases > maxCar.totalCases){
                maxCar = car;
            }
        }
        return maxCar;
    }
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

    const result = await Triage.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            }
        },
        {
            $group: {
                _id: "$car_nb",
                caseCount: { $sum: 1 }
            }
        },
        {
            $sort: { caseCount: -1 }
        },
        {
            $limit: 1
        }
    ]);
    if(result.length === 0){
        return null;
    }
    return result;
})

export { addCar, getCars, getCarById, updateCar, deleteCar, getAddCarForm, getEditCarForm, getMostCasesCar };