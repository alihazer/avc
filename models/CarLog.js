import mongoose from "mongoose";


const CarLogSchema = new mongoose.Schema({
    action:{
        type: String,
        enum: ["Added", "Used"],
        required: true,
    },
    carId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Car",
        required: true
    },
    materials_added: [{ 
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
}, { timestamps: true });

const CarLog = mongoose.model("CarLog", CarLogSchema);
export default CarLog;