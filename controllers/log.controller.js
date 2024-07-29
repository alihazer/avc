import CarLog from "../models/CarLog.js";
import moment from "moment";
import asyncHandler from "express-async-handler";
// get all logs
// GET /api/logs
// Private/Admin

const getLogs = asyncHandler(async (req, res) => {
    try {
        const carId = req.params.id;
        const logs = await CarLog.find({carId})
                .populate("carId")
                .sort({createdAt: -1})
                .populate({
                    path: 'user',
                    select: '-password'
                })
                .populate("materials_added._id");
        res.render("allLogs", {logs, moment});
    } catch (error) {
        console.log(error);
        res.status(400);
        throw new Error(error.message);
    }
});

export { getLogs };