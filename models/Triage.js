import mongoose from "mongoose";

const TriageSchema = new mongoose.Schema({
    time:{
        type: String,
        required: true
    },
    case_type: {
        type: String,
        required: true,
        enum: ["emergency", "medical", "death", "accident", "change", "inside", "fire"]
    },
    car_nb:{
        type: Number,
        default: null
    },
    from: {
        type: String,
    },
    to:{
        type: String,
    },
    driver:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    paramedics:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: null,
        max: 4,
    },
    patient_name:{
        type: String,
    },
    address:{
        type: String,
    },
    avpu:{
        type: String,
        enum: ["Alert", "Verbal", "Pain", "Unresponsive"]
    },
    ppte:{
        type: String,
        required: false,
        enum: ["Positive", "Negative"],
        default: null
    },
    moi:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Moi",
        default: null
    },
    dcap_btls:{
        d: Boolean,
        c: Boolean,
        a: Boolean,
        p: Boolean,
        b: Boolean,
        t: Boolean,
        l: Boolean,
        s: Boolean,
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
    medicalHistory:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "MedicalHistory",
        default: null
    },
    surgicalHistory:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "SurgicalHistory",
        default: null
    },
    allergies:{
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Allergies",
        default: null
    },
    usage: [{
        _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Material",
        },
        quantity: {
            type: Number,
        }
    }],
    notes: {
        type: String,
    },
    approval_nb:{
        type: Number,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

// Indexes
TriageSchema.index({ time: 1 }); // Index on time field
TriageSchema.index({ case_type: 1 }); // Index on case_type field
TriageSchema.index({ car_nb: 1 }); // Index on car_nb field
TriageSchema.index({ driver: 1 }); // Index on driver field
TriageSchema.index({ patient_name: 1 }); // Index on patient_name field
TriageSchema.index({ avpu: 1 }); // Index on avpu field
TriageSchema.index({ approval_nb: 1 }); // Index on approval_nb field

const Triage = mongoose.model("Triage", TriageSchema);

export default Triage;
