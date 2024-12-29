import Attendence from "../models/Attendence.js";
import asyncHandler from "express-async-handler";
import getLayoutName from "../utils/getLayoutName.js";
import User from "../models/User.js";

const fetchALLAttendencesForUser = asyncHandler(async (req, res) => {
    try {
        const user = req.user.id;
        const layout = getLayoutName(req);
        const attendenceList = await Attendence.find({ "createdBy": user}).populate("attendedUsers.user").sort({ createdAt: -1 });
        res.status(200).render("attendenceForManager", {attendenceList, layout});
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch attendence list");
    }
});

const fetchUsersForShift = asyncHandler(async (req, res) => {
    const { shiftDay, date } = req.body;

    try {
        // Fetch users whose shiftDays include the selected shiftDay exxcept the current user
        const users = await User.find({
            shiftDays: shiftDay,
        });
        res.status(200).render("selectUsersAndArrivalTime", {
            shiftDay,
            date,
            users,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error fetching users for the selected shift day.");
    }
});


const createAttendence = asyncHandler(async (req, res) => {
    try {
        const { shiftDay, date, attendedUsers } = req.body;
        const createdBy = req.user.id;
        console.log(req.body);
        console.log(createdBy);

        // Filter out invalid entries
        const validAttendedUsers = attendedUsers.filter(
            // Ensure that the entry has a user and arrivalTime
            (entry) => entry.user && entry.arrivalTime
        );
        if (validAttendedUsers.length === 0) {
            throw new Error("No valid attendees selected.");
        }

        // Validate the shiftDay input to ensure it matches the enum
        const validShiftDays = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        if (!validShiftDays.includes(shiftDay)) {
            throw new Error("Invalid shift day selected.");
        }

        // Create the attendance document
        const attendence = new Attendence({
            shiftDay,
            date,
            attendedUsers: validAttendedUsers,
            createdBy
        });

        await attendence.save();
        res.status(201).redirect("/attendence");
    } catch (error) {
        const layout = getLayoutName(req);
        console.log(error);
        res.status(400).render("error", {message: error.message, layout});
    }
});


const fetchAttendencesForAdmin = asyncHandler(async (req, res) => {
    try {
        const layout = getLayoutName(req);
        const shiftDayFilter = req.query.shiftDay;

        // If a shiftDay filter is provided, filter by that day
        const filter = shiftDayFilter ? { shiftDay: shiftDayFilter } : {};

        const attendenceList = await Attendence.find(filter).populate("attendedUsers.user").sort({ createdAt: -1 });

        res.status(200).render("attendence", { attendenceList, layout, shiftDayFilter });
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch attendance list");
    }
});


const fetchAttendenceById = asyncHandler(async (req, res) => {
    try {
        const id = req.params.id;
        const attendence = await Attendence.findById(id).populate("attendedUsers.user");
        res.status(200).render("attendenceDetails", {attendence});
    } catch (error) {
        console.log(error);
        throw new Error("Failed to fetch attendence");
    }
});

export {fetchALLAttendencesForUser, fetchUsersForShift, createAttendence, fetchAttendencesForAdmin, fetchAttendenceById};    