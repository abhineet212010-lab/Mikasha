const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
    name: "afk",

    data: new SlashCommandBuilder()
        .setName("afk")
        .setDescription("Set your AFK status.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for being AFK")
                .setRequired(false)
        ),

    async execute(interaction) {

        const reason =
            interaction.options.getString("reason") || "No reason provided.";

        let userData = await User.findOne({
            userId: interaction.user.id,
            guildId: interaction.guild.id
        });

        if (!userData) {

            userData = await User.create({
                userId: interaction.user.id,
                guildId: interaction.guild.id
            });

        }

        userData.afk = true;
        userData.afkReason = reason;
        userData.afkSince = Date.now();

        await userData.save();

        const embed = new EmbedBuilder()
            .setColor("#FEE75C")
            .setTitle("🌙 AFK Enabled")
            .setDescription(`You are now AFK.\n\n**Reason:** ${reason}`)
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }
};
