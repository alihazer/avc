import mongoose from "mongoose";

const MoiSchema = new mongoose.Schema({
    // MOI: Mechanism of Injury
    name: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Moi = mongoose.model("Moi", MoiSchema);
export default Moi;