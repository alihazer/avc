import mongoose from "mongoose";

const ItemBarCodeSchema = new mongoose.Schema({
    barCode: {
        type: String,
        required: true
    }
});

const ItemBarCode = mongoose.model("ItemBarCode", ItemBarCodeSchema);
export default ItemBarCode;