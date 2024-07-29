import mongoose from "mongoose";

const CarSchema = new mongoose.Schema({

    type: {
        type: String,
        required: true,
        enum: ['Ambulance', 'Fire truck','Rescue', 'Van']
    },
    number: {
        type: Number,
        required: true,
        unique: true
    },
    materials: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Material",
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 0
                }
            }
        ]
    },
    totalCases: {
        type: Number,
        default: 0
    },
}, { timestamps: true });

const Car = mongoose.model("Car", CarSchema);
export default Car;