import mongoose from "mongoose";

const materialsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    quantity:{
        type: Number,
        required: true
    },
    image:{
        type: String,
        required: true,
    },
},{timestamps: true});

const Material = mongoose.model('Material', materialsSchema);
export default Material;