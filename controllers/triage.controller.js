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
    const selectedCar = await Car.findOne({ number: parseInt(car) }).populate('materials._id').exec();
    if (!selectedCar) return false;

    materials = JSON.parse(materials);
    const materialsUsed = [];
    const materialsInCar = selectedCar.materials;

    for (const material of materials) {
        const materialInCar = materialsInCar.find(mat => mat._id._id.toString() === material._id);

        if (!materialInCar || materialInCar.quantity < material.quantity) return false;

        materialInCar.quantity -= material.quantity;
        materialsUsed.push({ _id: material._id, quantity: material.quantity });
    }

    await CarLog.create({
        action: "Used",
        carId: selectedCar._id,
        materials_added: materialsUsed,
        user: userId,
    });

    return materialsUsed;
};

const assignValues = (details) => {
    const [
        from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure,
        heartRate, spo2, temperature, medicalHistory, surgicalHistory, fromOther, toOther
    ] = details.map(detail => detail || null);

    return {
        from: from === "Other" ? fromOther : from,
        to: to === "Other" ? toOther : to,
        driver, paramedics, patient_name,
        avpu, ppte: avpu === "Alert" ? ppte : null,
        moi, preassure, heartRate, spo2, temperature,
        medicalHistory, surgicalHistory
    };
};

const createEmergencyTriage = asyncHandler(async (req, res) => {
    try {
        const { time, date, type, from, to, bloodglucoseLevel ,driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature, medicalHistory, surgicalHistory, approval_nb, usage, dcap_btls, toOther, fromOther, triageLevel, notes, foodAllergies, inhalorAllergies, medicationAllergies } = req.body;
        const layout = getLayoutName(req);

        if (!time) return res.render("error", { message: "Time is required", layout });

        const [hours, minutes] = time.split(':').map(Number);
        if (hours > 23 || minutes > 59) return res.render("error", { message: "Invalid time", layout });

        const time12 = moment().hours(hours).minutes(minutes).format('h:mm A');
        const car = req.query.car;
        const allDetails = [from, to, driver, paramedics, patient_name, avpu, ppte, moi, preassure, heartRate, spo2, temperature, medicalHistory, surgicalHistory, fromOther, toOther];
        const details = assignValues(allDetails);

        let materials = [];
        if (Array.isArray(usage) && usage[1].length > 2) {
            materials = await isMaterialAvailable(car, usage[1], req.user.id);
            if (!materials) return res.status(400).render("error", { message: "No enough materials in the car", layout });
        }

        const vitals = {
            heartRate: details.heartRate,
            spo2: details.spo2,
            temperature: details.temperature,
            bloodPressure: details.preassure
        };

        const triage = await Triage.create({
            time: time12,
            date,
            case_type: type,
            car_nb: car,
            ...details,
            vitals,
            usage: materials,
            dcap_btls: dcap_btls ? JSON.parse(dcap_btls) : null,
            userId: req.user.id,
            approval_nb,
            triageLevel,
            notes,
            foodAllergies,
            inhalorAllergies,
            medicationAllergies,
            bloodglucoseLevel
        });

        const selectedCar = await Car.findOne({ number: parseInt(car) });
        const totalCasesOfTheCar = await Triage.countDocuments({ car_nb: car });
        selectedCar.totalCases = totalCasesOfTheCar + 1;
        await selectedCar.save();
        return triage ? res.status(201).redirect(`/triage/generate-pdf/${triage._id}`) : res.status(400).render("error", { message: "An error occurred", layout });
    } catch (error) {
        console.error(error);
        const layout = getLayoutName(req);
        return res.status(400).render("error", { message: "An error occurred", layout });
    }
});


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
            'role.name': { $in: ['driver', 'shiftmanager'] }
          }
        },
        {
          $project: {
            _id: 1,          // Include _id
            username: 1,  
            fullNameInArabic: 1    // Include username
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
    if(type === "rescue"){
        return res.status(200).render("rescueTriageForm", { type, car, materials, paramedics, layout, drivers, locations });
    }
    if(type === "activity"){
        return res.status(200).render("activityTriageForm", { type, car, paramedics, layout, drivers });
    }
    if(type === "غارة"){
        return res.status(200).render("gharaTriageForm", { type, car, materials, paramedics, layout, drivers, locations, mois });
    }
    if(type === "borrow"){
        return res.status(200).render("borrowTriageForm", { type, car, paramedics, layout, drivers, locations });
    }
    if(type === "scout"){
        return res.status(200).render("scoutTriageForm", { type, car, paramedics, layout, drivers, locations });
    }
    if(type === "football"){
        return res.status(200).render("footballTriageForm", { type, car, materials, paramedics, layout, drivers, locations });
    }
    if(type === "husseiniya"){
        return res.status(200).render("husseiniyaTriageForm", { type, car, materials, paramedics, layout, drivers, locations });
    }
    else{
        return res.status(400).render("error", { message: "Invalid Triage type", layout });
    }

});


const fetchMyTriages = async (req) => {
    // Get the user ID from the request object
    const userId = req.user.id;
    // Find all triages created by the user or user id is found in the paramedics array
    const triages = await Triage.find({ $or: [{ userId }, { paramedics: userId }, {driver: userId }] });
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
        const allTriages = await Triage.find({}).exec();
        const thisMonthTriages = await Triage.find({createdAt: {$gte: new Date(new Date().getFullYear(), thisMonth, 1), $lt: new Date(new Date().getFullYear(), thisMonth + 1, 0)}}).exec();
        const data = {
            count: triages.length,
            thisMonth: thisMonthTriages.length,
            allTriages: allTriages.length
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
    const thisMonthTriages = await Triage.find({date: {$gte: new Date(new Date().getFullYear(), thisMonth, 1), $lt: new Date(new Date().getFullYear(), thisMonth + 1, 0)}})
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
        .populate({path: 'driver'})
        .populate({path: 'paramedics'})
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
            case "rescue":
                return res.status(200).render("partials/triage/rescue", {triage, moment, type: "إنقاذ", layout});
            case "غارة":
                return res.status(200).render("partials/triage/ghara", {triage, moment, type: "غارة", layout});
            case "activity":
                return res.status(200).render("partials/triage/activity", {triage, moment, type: "نشاط", layout});
            case "borrow":
            case "scout":
            case "football":
            case "husseiniya":
                const casType = types.find(t => t.code.toString() === triage.case_type.toString());
                return res.status(200).render("partials/triage/other", {triage, moment, type: casType.name, layout});
            default:
                return res.status(200).render("error", {message: "Something went wrong", layout});
        }
    } catch (error) {
        console.log(error);
        const layout = getLayoutName(req);
        return res.status(404).render("error", {message: "Triage not found", layout});
    }
});


const getTheMostDayTriagesInTheMonth = asyncHandler(async () => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const triages = await Triage.aggregate([
        {
            $match: {
                date: {
                    $gte: startOfMonth,
                    $lt: endOfMonth
                }
            }
        },
        {
            $addFields: {
                // Adjust UTC date to local time (e.g., UTC+6)
                localDate: {
                    $add: ["$date", 6 * 60 * 60 * 1000] // Replace 6 with your timezone offset
                }
            }
        },
        {
            $addFields: {
                // Determine if the local time is before 6 PM
                isBefore6PM: {
                    $lt: [{ $hour: "$localDate" }, 18]
                }
            }
        },
        {
            $addFields: {
                // Calculate shiftDay in local time (previous day if before 6 PM)
                shiftDayLocal: {
                    $cond: [
                        "$isBefore6PM",
                        { $subtract: ["$localDate", 24 * 60 * 60 * 1000] }, // Subtract 1 day
                        "$localDate"
                    ]
                }
            }
        },
        {
            $addFields: {
                // Truncate to the start of the day in local time
                shiftDayStart: {
                    $dateTrunc: {
                        date: "$shiftDayLocal",
                        unit: "day"
                    }
                }
            }
        },
        {
            $addFields: {
                // Get the day of the week in the local timezone
                shiftDayOfWeek: {
                    $dayOfWeek: {
                        date: "$shiftDayStart",
                        timezone: "Asia/Dhaka" // Replace with your timezone
                    }
                }
            }
        },
        {
            $group: {
                _id: "$shiftDayOfWeek",
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);

    // Convert day numbers (1-7, Sunday=1) to names
    const triagesWithDayNames = triages.map(triage => ({
        ...triage,
        day: dayNames[triage._id - 1] // Adjust index to start from 0
    }));

    return triagesWithDayNames;
});


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


function isLeapYear(year) {
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
}

const getTriageByMonth = async (year, month, page = 1, limit = 5) => {
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    try {
        let startDate = null;
        let endDate = null;

        if (year && month && !isNaN(year) && !isNaN(month) && month >= 1 && month <= 12) {  
            startDate = new Date(`${year}-${month.toString().padStart(2, '0')}-01`);
            if (parseInt(month) === 2) {
                if (isLeapYear(year)) {
                    endDate = new Date(`${year}-${month.toString().padStart(2, '0')}-29`); // Leap year (29 days)
                } else {
                    endDate = new Date(`${year}-${month.toString().padStart(2, '0')}-28`); // Non-leap year (28 days)
                }
            } else if ([4, 6, 9, 11].includes(month)) {
                endDate = new Date(`${year}-${month.toString().padStart(2, '0')}-30`);
            } else {

                endDate = new Date(`${year}-${month.toString().padStart(2, '0')}-31`);
            }

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return null;
            }
        }

        const query = startDate && endDate ? { date: { $gte: startDate, $lt: endDate } } : {};

        const triages = await Triage.find(query)
            .populate('moi')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const totalTriages = await Triage.countDocuments(query);
        const totalPages = Math.ceil(totalTriages / limitNum);

        return { triages, totalPages, currentPage: pageNum, totalTriages };
    } catch (error) {
        console.error(error);
        return null;
    }
};



const getTriageWithPagination = asyncHandler(async (req, res) => {
    const { year, month } = req.query;
    const { page } = req.query;

    try {
        const data = await getTriageByMonth(year, month, page, 20);
        
        if (!data) {
            return res.status(400).render('allTriagesWithFilter', {
                triages: [],
                selectedYear: year,
                selectedMonth: month,
                currentPage: 1,
                totalPages: 1,
                moment
            }
            );
        }

        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.json(data); 
        }
        else {
            res.render('allTriagesWithFilter', {
                triages: data.triages,
                selectedYear: year,
                selectedMonth: month,
                currentPage: data.currentPage,
                totalPages: data.totalPages,
                moment,
                total: data.totalTriages
            });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).render("error", { message: "Error fetching triages" });
    }
});


const getTriageStats = asyncHandler(async (req, res) => {
    const year = parseInt(req.params.year);

    try {
        const triageData = await Triage.aggregate([
            {
                $match: {
                    date: {
                        $gte: new Date(`${year}-01-01`),
                        $lt: new Date(`${year + 1}-01-01`)
                    }
                }
            },
            {
                $group: {
                    _id: { month: { $month: "$date" }, case_type: "$case_type" },
                    count: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: "$_id.case_type",
                    data: {
                        $push: {
                            month: "$_id.month",
                            count: "$count"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    case_type: "$_id",
                    data: 1
                }
            }
        ]);

        const totalCases = await Triage.countDocuments({
            date: {
                $gte: new Date(`${year}-01-01`),
                $lt: new Date(`${year + 1}-01-01`)
            }
        });
        return res.status(200).json({
            status: true,
            data: triageData,
            totalCases
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            message: "Error fetching triage data"
        });
    }
});


const renderTriageStatsPage = asyncHandler(async (req, res) => {
    const layout = getLayoutName(req);
    return res.render('triageStats', { layout });
});


const deleteTriage = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const triage = await Triage.findById(id);
        if (!triage) {
            return res.redirect('/triage/all');
        }
        await Triage.findByIdAndDelete(id);
        return res.redirect('/triage/all');
    } catch (error) {
        console.error(error);
        return res.redirect('/triage/all');
    }
});




export { renderFirstForm, createEmergencyTriage, getLoggedInUserTriages, getMyTriagesCount, getThisMonthsTriages, generatePdf, getTriage, getTheMostDayTriagesInTheMonth, renderEditTriage, editTriage, getTriageByMonth, getTriageWithPagination, getTriageStats, renderTriageStatsPage, deleteTriage};
