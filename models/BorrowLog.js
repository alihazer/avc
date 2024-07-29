import mongoose from "mongoose";

const BorrowLogSchema = new mongoose.Schema({
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "BorrowItem",
        required: true
    },
    borrower: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },

    responsiblePerson:{
        name:{
            type: String,
        },
        phoneNumber:{
            type: String,
        }
    },
    age: {
        type: Number,
    },
    difficulty: {
        type: String,
    },
    imageOnBorrow: {
        type: String
    },
    imageOnReturn:{
        type: String
    },
    borrowDate: {
        type: Date,
        required: true
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    actualReturnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ["borrowed", "returned"],
        default: "borrowed"
    }
});

const BorrowLog = mongoose.model("BorrowLog", BorrowLogSchema);
export default BorrowLog;
