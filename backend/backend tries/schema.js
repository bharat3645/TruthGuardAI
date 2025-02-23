const mongoose = require("mongoose");

// Define Schema for Detection Records
const detectionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["news", "image", "video", "audio"],
        required: true
    },
    data: {
        type: String,
        required: true
    },
    isAuthentic: {
        type: Boolean,
        required: true
    },
    confidence: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model("Detection", detectionSchema);