import mongoose from "mongoose";

const SurgicalHistorySchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
}
);

const SurgicalHistory = mongoose.model('SurgicalHistory', SurgicalHistorySchema);
export default SurgicalHistory;