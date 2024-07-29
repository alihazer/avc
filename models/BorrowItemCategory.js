import mongoose from "mongoose";

const BorrowItemCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    quantity:{
        type: Number,
        required: true,
        default: 0
    },
    borrowedQuantity:{
        type: Number,
        required: true,
        default: 0
    },
    image:{
        type: String,
        required: true
    }
});

const BorrowItemCategory = mongoose.model("BorrowItemCategory", BorrowItemCategorySchema);
export default BorrowItemCategory;
