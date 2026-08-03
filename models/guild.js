const mongoose = require("mongoose");

const guildSchema = new mongoose.Schema({

    guildId: {
        type: String,
        required: true,
        unique: true
    },

    // Welcome System
    welcomeChannel: {
        type: String,
        default: null
    },

    // Goodbye System
    goodbyeChannel: {
        type: String,
        default: null
    },

    // Logs System
    logChannel: {
        type: String,
        default: null
    },

    // Ticket System
    ticketCategory: {
        type: String,
        default: null
    },

    ticketLogs: {
        type: String,
        default: null
    },

    supportRole: {
        type: String,
        default: null
    },

    // AutoMod
    antiLink: {
        type: Boolean,
        default: false
    },

    antiInvite: {
        type: Boolean,
        default: false
    },

    antiSpam: {
        type: Boolean,
        default: false
    },

    antiBadWords: {
        type: Boolean,
        default: false
    },

    antiMention: {
        type: Boolean,
        default: false
    },

    antiGhostPing: {
        type: Boolean,
        default: false
    },

    antiRaid: {
        type: Boolean,
        default: false
    },

    // Prefix
    prefix: {
        type: String,
        default: "!"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Guild", guildSchema);
