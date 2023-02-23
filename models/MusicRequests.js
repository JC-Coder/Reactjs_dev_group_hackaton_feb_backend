const mongoose = require("mongoose");

const MusicRequestSchema = new mongoose.Schema({
    name: String,
    artist: String,
    albumArt: String,
    userId: String,
    requestedAt: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: 'not played',
        enum: ['played', 'not played', 'unavailable'],
        trim: true
    }
}, {timestamps: true});

const MusicRequest = mongoose.model("MusicRequest", MusicRequestSchema);
module.exports = MusicRequest;