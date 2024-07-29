import Triage from "../models/Triage.js";
import Material from "../models/Material.js";
import MedicalHistory from "../models/MedicalHistory.js";
import SurgicalHistory from "../models/SurgicalHistory.js";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Car from "../models/Car.js";
import types from "../utils/TriageTypes.js";
import locations from "../utils/Locations.js";
import Moi from "../models/Moi.js";
import CarLog from "../models/CarLog.js";
import moment from "moment";
import getLayoutName from "../utils/getLayoutName.js";



const isMaterialAvailable = async (car, materials, userId) => {
    const selectedCar = await Car.findOne({number: parseInt(car)}).populate('materials._id').exec();
    const materialsInCar = selectedCar.materials;
    materials = JSON.parse(materials);
    const materialsUsed = [];

    materials.forEach(material => {
        // Check if the material is already added and update the quantity if it is
        const materialInCar = materialsInCar.find((mat)=>{
            return mat._id._id.toString() === material._id;
        });
        // If the material is not in the car
        if(!materialInCar){
            return false;
        }
        // If the quantity is greater than the quantity in the car
        if(materialInCar.quantity < material.quantity){
            return false;
        }
        // Update the quantity of the material in the car
        materialInCar.quantity -= material.quantity;
        // Add the material to the materials used
        materialsUsed.push({ _id: material._id, quantity: material.quantity });
    });
    selectedCar.totalCases += 1;
    await selectedCar.save();
    // Create Log for the materials used
    const log = {
        action: "Used",
        carId: selectedCar._id,
        materials_added: materialsUsed,
        user: userId,
    };
    materials = materialsUsed;
    await CarLog.create(log);
    return materials;
};

const assignValues = (allDetails) => {
    for(let i = 0; i < allDetails.length; i++){
        if(Array.isArray(allDetails[i]) && allDetails[i].length === 0){
            allDetails[i] = [];
        }
        if(!allDetails[i]){
            allDetails[i] = null;
        }
    }
    let [from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature, medicalHistory, surgicalHistory, fromOther, toOther] = allDetails;
    if(avpu !== "Alert"){
        ppte = null;
    }
    if(from === "Other"){
        from = fromOther;
    }
    if(to === "Other"){
        to = toOther;
    }
    return {from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature, medicalHistory, surgicalHistory};
};


// @desc render the first form
// @route GET /triage/create

const renderFirstForm = asyncHandler(async (req, res) => {
    const type = req.query.type;
    const car = req.query.car;
    const layout = getLayoutName(req);
    if(!type && !car){ 
        const cars = await Car.find({});
        return res.status(200).render("selectTriageType", { types, cars, layout });
    }
    const selectedCar = await Car.findOne({number: parseInt(car)}).populate('materials._id').exec();
    let materials = selectedCar.materials;
    //filter materials that are not empty
    materials = materials.filter((material)=>{ return material.quantity > 0});
    if(materials.length === 0){
        materials = [];
    }
    const medicalHistories = await MedicalHistory.find({});
    const surgicalHistories = await SurgicalHistory.find({});
    const mois = await Moi.find({});
    const drivers = await User.aggregate([
        {
          $lookup: {
            from: 'roles',
            localField: 'role',
            foreignField: '_id',
            as: 'role'
          }
        },
        {
          $unwind: '$role'
        },
        {
          $match: {
            'role.name': 'driver'
          }
        },
        {
          $project: {
            _id: 1,          // Include _id
            username: 1,      // Include username
          }
        }
      ]);

    const paramedics = await User.find({});
    
    if(type === "emergency"){
        return res.status(200).render("emergencyTriageForm", {type, car, materials, medicalHistories, surgicalHistories, drivers, paramedics, locations, mois, layout });
    }
    if(type === "medical"){
        return res.status(200).render("medicalTriageForm", { type, car, materials, medicalHistories, surgicalHistories, drivers, paramedics,locations, layout });
    }
    if(type === "death"){
        return res.status(200).render("deathTriageForm", { type, car, drivers, paramedics, locations, layout });
    }
    if(type === "accident"){
        return res.status(200).render("accidentTriageForm", {type, car, materials, medicalHistories, surgicalHistories, drivers, paramedics, locations, mois, layout });
    }
    if(type === "change"){
        return res.status(200).render("changeTriageForm", { type, car, materials, paramedics, layout });
    }
    if(type === "inside"){
        return res.status(200).render("insideTriageForm", { type, car, materials, paramedics, mois, layout, medicalHistories, surgicalHistories });
    }
    if(type === "fire"){
        return res.status(200).render("fireTriageForm", { type, car, materials, paramedics, layout, drivers, locations });
    }


});



const createEmergencyTriage = asyncHandler(async (req, res) => {
    try {
        let { time, type, from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature, medicalHistory, surgicalHistory ,approval_nb, usage, dcap_btls, toOther, fromOther } = req.body;
        const layout = getLayoutName(req);
        if(!time){
            return res.render("error", {message: "Time is required", layout});
        }
        if(dcap_btls){
            dcap_btls = JSON.parse(dcap_btls);
        }
        else{
            dcap_btls = null;
        }
        console.log(approval_nb);
        const [hours, minutes] = time.split(':').map(Number);
        if (hours > 23 || minutes > 59) {
            return res.render("error", {message: "Invalid time"});
        }
        const time12 = moment().hours(hours).minutes(minutes).format('h:mm A');
        const car = req.query.car;
        let allDetails = [from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature ,medicalHistory, surgicalHistory, fromOther, toOther];
        let materials = [];
        if(Array.isArray(usage) && usage.length > 0){
            if(usage[1] !== ''){
                materials = await isMaterialAvailable(car, usage[1], req.user.id);
                if(!materials){
                    return res.status(400).render("error", {message: "No enough materials in the car", layout});
                }
            }
        }
        const details = assignValues(allDetails);
        const vitals = {
            heartRate: details.heartRate,
            spo2: details.spo2,
            temperature: details.temperature,
            preassure: details.preassure
        };
        const triage = await Triage.create({
            time: time12,
            case_type: type,
            car_nb: car,
            ...details,
            vitals,
            usage: materials,
            dcap_btls,
            userId: req.user.id,
            approval_nb
        });
        
        if(triage){
            return res.status(201).redirect(`/triage/generate-pdf/${triage._id}`);
        }
        return res.status(400).render("error", {message: "An error occured", layout});
    } catch (error) {
        const layout = getLayoutName(req);
        console.log(error);
        return res.status(400).render("error", {message: "An error occured", layout});
    }
    });

const fetchMyTriages = async (req) => {
    let triages = await Triage.find({userId: req.user.id})
        .populate('moi')
        .populate({
            path: 'userId',
            select: 'username'
        })
        .sort({createdAt: -1})
        .lean()
        .exec();
    return triages;
};



const getLoggedInUserTriages = asyncHandler(async(req, res)=>{
    const triages = await fetchMyTriages(req);
    const layout = getLayoutName(req);
    if(!triages){
        return res.status(404).render("error", {message: "No triages found", layout});
    }
    return res.status(200).render("triages", {triages, moment, layout});
})


const getMyTriagesCount = asyncHandler(async(req, res)=>{
    try {
        const triages = await fetchMyTriages(req);
        const thisMonth = new Date().getMonth();
        const thisMonthTriages = await Triage.find({createdAt: {$gte: new Date(new Date().getFullYear(), thisMonth, 1), $lt: new Date(new Date().getFullYear(), thisMonth + 1, 0)}}).exec();
        const data = {
            count: triages.length,
            thisMonth: thisMonthTriages.length
        }
        if(!triages){
            return 0;
        }
        return data;
    } catch (error) {
        console.log(error);
    }
});

const getThisMonthsTriages = asyncHandler(async(req, res)=>{
    const layout = getLayoutName(req);
    const thisMonth = new Date().getMonth();
    const thisMonthTriages = await Triage.find({createdAt: {$gte: new Date(new Date().getFullYear(), thisMonth, 1), $lt: new Date(new Date().getFullYear(), thisMonth + 1, 0)}})
    .populate('moi')
    .lean()
    .sort({createdAt: -1})
    .exec();
    return res.status(200).render('thisMonthTriages', {triages: thisMonthTriages, moment, layout});
});

const generatePdf = asyncHandler(async(req, res)=>{
    return res.render("generatePdf", {id: req.params.id});
});

const getTriage = asyncHandler(async(req, res)=>{
    try {
        const layout = getLayoutName(req);
        const triage = await Triage.findById(req.params.id)
        .populate('moi')
        .populate({path: 'userId', select: 'username'})
        .populate('usage._id')
        .populate({path: 'driver', select: 'username'})
        .populate({path: 'paramedics', select: 'username'})
        .populate('moi')
        .populate('medicalHistory')
        .populate('surgicalHistory')
        .exec();
    
        if(!triage){
            return res.status(404).render("error", {message: "Triage not found"}, layout);
        }
        switch(triage.case_type){
            case "emergency":
                return res.status(200).render("partials/triage/emergency", {triage, moment, type: "حالة طارئة", layout});
                break;
            case "accident":
                return res.status(200).render("partials/triage/accident", {triage, moment ,type: "حادث سير", layout});
                break;
            case "medical":
                return res.status(200).render("partials/triage/medical", {triage, moment, type: "حالة مرضية", layout});
                break;
            case "death":
                return res.status(200).render("partials/triage/death", {triage, moment, type: "حالة وفاة", layout});
                break;
            case "change":
                return res.status(200).render("partials/triage/change", {triage, moment, type: "تغيير", layout});

            case "inside":
                return res.status(200).render("partials/triage/inside", {triage, moment, type: "داخل", layout});
            case "fire":
                return res.status(200).render("partials/triage/fire", {triage, moment, type: "حريق", layout});
            default:
                return res.status(200).render("error", {message: "Something went wrong", layout});
        }
    } catch (error) {
        console.log(error);
        const layout = getLayoutName(req);
        return res.status(404).render("error", {message: "Triage not found", layout});
    }
});


const getTheMostDayTriagesInTheMonth = asyncHandler(async()=>{
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
    
    const triages = await Triage.aggregate([
        {
            $match: {
                createdAt: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            }
        },
        {
            $addFields: {
                shiftStart: {
                    $cond: [
                        { $lt: [{ $hour: "$createdAt" }, 18] },
                        { $subtract: ["$createdAt", 24 * 60 * 60 * 1000] },
                        "$createdAt"
                    ]
                }
            }
        },
        {
            $addFields: {
                dayOfWeek: { $dayOfWeek: { $subtract: ["$shiftStart", 6 * 60 * 60 * 1000] } }
            }
        },
        {
            $group: {
                _id: { dayOfWeek: "$dayOfWeek" },
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    

    
    
    // Map day numbers to day names
    const triagesWithDayNames = triages.map(triage => ({
        ...triage,
        _id: {
            ...triage._id,
            dayOfWeek: dayNames[triage._id.dayOfWeek - 1] // dayOfWeek is 1-based, array is 0-based
        }
    }));
    return triagesWithDayNames;
})


const renderEditTriage = asyncHandler(async(req, res)=>{
    const { id } = req.params;
    const layout = getLayoutName(req);
    const triage = await Triage.findById(id)
    
    return res.status(200).render("editTriage", {triage, layout});
});
const editTriage = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const { approval_nb } = req.body;
        console.log(approval_nb);
        // Find the Triage document by ID
        let triage = await Triage.findById(id);
        // Check if the Triage document exists
        if (!triage) {
            return res.status(404).json({ status: false, message: "Triage not found" });
        }
        
        // Update the approval_nb field
        triage.approval_nb = approval_nb;
        // Save the updated document
        await triage.save();
        // Respond with success message
        return res.status(200).json({ status: true, message: "Triage updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ status: false, message: "Triage update failed" });
    }
});



export { renderFirstForm, createEmergencyTriage, getLoggedInUserTriages, getMyTriagesCount, getThisMonthsTriages, generatePdf, getTriage, getTheMostDayTriagesInTheMonth, renderEditTriage, editTriage};
