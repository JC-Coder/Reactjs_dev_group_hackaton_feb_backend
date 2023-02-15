const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    userId: String,
    access: {
        type: String,
        default: 'user',
        enum: ['user', 'dj']
    },
    title: {
        type: String,
        rquired: [true, 'title cannot be empty']
    },
    message: String,
}, {timestamps: true})

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification