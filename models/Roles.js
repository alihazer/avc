import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        enum: ["superadmin", "admin", "stockmanager", "shiftmanager", "driver","paramedic"]
    },
    permissions:{
        type: [String],
        required: true,
        default: []
    }
});

const Role = mongoose.model('Role', roleSchema);
export default Role;