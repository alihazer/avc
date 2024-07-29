import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema({
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    ],
    date: {
        type: Date,
        required: true
    },
    remarks: {
        type: String,
        required: false
    },
    shiftManager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {timestamps: true});

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
