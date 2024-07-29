import mongoose from "mongoose";

const MedicalHistorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
}
);

const MedicalHistory = mongoose.model('MedicalHistory', MedicalHistorySchema);
export default MedicalHistory;