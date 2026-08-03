const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    guildId: {
        type: String,
        required: true
    },

    userId: {
        type: String,
        required: true
    },

    // Level System
    xp: {
        type: Number,
        default: 0
    },

    level: {
        type: Number,
        default: 1
    },

    // Economy (Future)
    balance: {
        type: Number,
        default: 0
    },

    bank: {
        type: Number,
        default: 0
    },

    // Moderation
    warns: {
        type: Number,
        default: 0
    },

    // AFK System
    afk: {
        type: Boolean,
        default: false
    },

    afkReason: {
        type: String,
        default: null
    },

    afkSince: {
        type: Number,
        default: null
    }

}, {
    timestamps: true
});

userSchema.index({
    guildId: 1,
    userId: 1
}, {
    unique: true
});

module.exports = mongoose.model("User", userSchema);
