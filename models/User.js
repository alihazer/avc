import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },
    role:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        required: true
    },
    profileImage:{
        type: String,
        required: false,
    },
    bloodType:{
        type: String,
        enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    phone:{
        type: String,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        required: true,
        default: "active"
    },
    shiftDays:{
        type: [String],
        default: []
    },
    dob:{
        type: Date,
    },
    badleSize:{
        type: String,
        enum: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'],
        default: 'xl'
    },
    kanzeSize: {
        type: String,
        enum: ['s', 'm', 'l', 'xl', 'xxl', 'xxxl'],
        default: 'xl'
    },
    rangerSize: {
        type: Number,
        enum: [38, 39, 40, 41, 42, 43, 44, 45, 46],
        default: 40
    }

},{timestamps: true});

const User = mongoose.model('User', userSchema);
export default User;