import mongoose from "mongoose";

const loginAttemptSchema = new mongoose.Schema({
    deviceInfo : { type: String, required: true },
    ipAddress: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});


loginAttemptSchema.index({ timestamp: 1 }, { expireAfterSeconds: 1800 });

export default mongoose.model("LoginAttempt", loginAttemptSchema);
