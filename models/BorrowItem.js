import mongoose from "mongoose";

const BorrowItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorrowItemCategory",
        required: true
    },
    image: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["available", "borrowed"],
        default: "available"
    },
    barCode:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ItemBarCode",
        required: true
    },
    code:{
        type: String,
        required: true,
        unique: true
    }

});

const BorrowItem = mongoose.model("BorrowItem", BorrowItemSchema);
export default BorrowItem;
