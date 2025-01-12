import mongoose from "mongoose";

const TriageSchema = new mongoose.Schema({
    time: {
        type: String,
        // removed required to make it nullable
    },
    case_type: {
        type: String,
        // removed required to make it nullable
        enum: ["emergency", "medical", "death", "accident", "change", "inside", "fire", "غارة", "rescue", "other"],
    },
    car_nb: {
        type: Number,
        default: null
    },
    from: {
        type: String,
        default: null // explicitly set default to null
    },
    to: {
        type: String,
        default: null // explicitly set default to null
    },
    driver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    paramedics: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
        max: 4,
    },
    patient_name: {
        type: String,
        default: null // explicitly set default to null
    },
    address: {
        type: String,
        default: null // explicitly set default to null
    },
    avpu: {
        type: String,
        enum: ["Alert", "Verbal", "Pain", "Unresponsive", "null"],
        default: null // explicitly set default to null
    },
    ppte: {
        type: String,
        enum: ["Positive", "Negative"],
        default: null // default is null
    },
    moi: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Moi",
        default: null
    },
    dcap_btls: {
        d: { type: Boolean, default: null },
        c: { type: Boolean, default: null },
        a: { type: Boolean, default: null },
        p: { type: Boolean, default: null },
        b: { type: Boolean, default: null },
        t: { type: Boolean, default: null },
        l: { type: Boolean, default: null },
        s: { type: Boolean, default: null },
    },
    vitals: {
        heartRate: {
            type: Number,
            default: null
        },
        bloodPressure: {
            type: String,
            default: null
        },
        spo2: {
            type: Number,
            default: null
        },
        temperature: {
            type: Number,
            default: null
        }
    },
    medicalHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "MedicalHistory",
        default: null
    },
    surgicalHistory: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "SurgicalHistory",
        default: null
    },
    foodAllergies: {
        type: String,
        default: null // explicitly set default to null
    },
    inhalorAllergies: {
        type: String,
        default: null // explicitly set default to null
    },
    medicationAllergies: {
        type: String,
        default: null // explicitly set default to null
    },
    usage: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
        },
        quantity: {
            type: Number,
            default: null // explicitly set default to null
        }
    }],
    notes: {
        type: String,
        default: null // explicitly set default to null
    },
    approval_nb: {
        type: Number,
        default: null // explicitly set default to null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null // explicitly set default to null
    },
    date: {
        type: Date,
        default: Date.now
    },
    triageLevel:{
        type: String,
        enum: ["1", "2","3+", "3", "4+", "4", "5"],

    }
}, { timestamps: true });

// Indexes
TriageSchema.index({ time: 1 }); // Index on time field
TriageSchema.index({ case_type: 1 }); // Index o

export default mongoose.model("Triage", TriageSchema);
