const { Schema, model } = require("mongoose");

const guildSchema = new Schema({

    guildId: {
        type: String,
        required: true,
        unique: true
    },

    prefix: {
        type: String,
        default: "!"
    },

    welcomeChannel: {
        type: String,
        default: null
    },

    goodbyeChannel: {
        type: String,
        default: null
    },

    logChannel: {
        type: String,
        default: null
    },

    autoRole: {
        type: String,
        default: null
    },

    modRole: {
        type: String,
        default: null
    }

}, {
    timestamps: true
});

module.exports = model("Guild", guildSchema);
