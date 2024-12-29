import express from "express";
import {fetchALLAttendencesForUser, createAttendence, fetchAttendencesForAdmin, fetchAttendenceById, fetchUsersForShift} from "../controllers/attendence.controller.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import checkPermission from "../middlewares/checkPermission.js";
import getLayoutName from "../utils/getLayoutName.js";
import User from "../models/User.js";

const router = express.Router();

router.get("/", isLoggedIn, checkPermission("manage_shifts"), fetchALLAttendencesForUser);
router.post("/create", isLoggedIn, checkPermission("manage_shifts"), createAttendence);
router.get("/all", isLoggedIn, checkPermission("manage_shifts"), fetchAttendencesForAdmin);
router.get("/:id", isLoggedIn, checkPermission("manage_shifts"), fetchAttendenceById);
router.post("/select-users", isLoggedIn, checkPermission("manage_shifts"), fetchUsersForShift );
router.get("/add/select-shift", isLoggedIn, checkPermission("manage_shifts"), async(req, res) => {
    const layout = getLayoutName(req);
    const user = await User.findById(req.user.id);
    
    const shiftDays = user.shiftDays;

    res.render("selectShiftDayAndDate", {layout, shiftDays});
});
router.get("/get/attendences", isLoggedIn, checkPermission("view_analytics"), fetchAttendencesForAdmin);
export default router;