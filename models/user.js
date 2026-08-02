const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },

    guildId: {
        type: String,
        required: true
    },

    xp: {
        type: Number,
        default: 0
    },

    level: {
        type: Number,
        default: 1
    },

    balance: {
        type: Number,
        default: 1000
    },

    bank: {
        type: Number,
        default: 0
    },

    warns: {
        type: Number,
        default: 0
    },

    daily: {
        type: Number,
        default: 0
    },

    inventory: {
        type: Array,
        default: []
    }

}, {
    timestamps: true
});

module.exports = model("User", userSchema);
