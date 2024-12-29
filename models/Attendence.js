import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    shiftDay: {
        type: String,
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: true,
    },
    date: {
        type: Date,
        required: true, // The specific date of the shift
    },
    attendedUsers: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User", // Reference to the User schema
                required: true,
            },
            arrivalTime: {
                type: String, // Use HH:mm format for time
                required: true,
            },
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true,
    },
}, { timestamps: true });

const Attendence = mongoose.model("Attendance", attendanceSchema);

export default Attendence;
