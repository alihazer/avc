import mongoose from "mongoose";

const LoggedInDevicesSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Link to the User model
    },
    deviceInfo: {
        type: String,
        required: true, // Example: "Chrome on Windows 10"
    },
    os: {
        type: String, // Example: "Windows 10"
    },
    browser: {
        type: String, // Example: "Chrome"
    },
    ipAddress: {
        type: String,
        required: true, // Captures IP address of login
    },
    macAddress: {
        type: String, // Captures MAC address of login
        required: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now, // Automatically logs login time
    },
    token: {
        type: String,
        required: true, // Store the JWT token for session validation
    },
    tokenExpiry: {
        type: Date, // Store when the token expires
    },
    isActive: {
        type: Boolean,
        default: true, // Indicates if the session is still active
    },
});

// Index for efficient querying of active devices per user
LoggedInDevicesSchema.index({ userId: 1, isActive: 1 });

const LoggedInDevicesModel = mongoose.model('LoggedInDevices', LoggedInDevicesSchema);
export default LoggedInDevicesModel;
