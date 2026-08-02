const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "slowmode",

    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Set slowmode for the current channel.")
        .addIntegerOption(option =>
            option
                .setName("seconds")
                .setDescription("Slowmode duration (0-21600 seconds)")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const seconds = interaction.options.getInteger("seconds");

        await interaction.channel.setRateLimitPerUser(seconds);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🐢 Slowmode Updated")
            .setDescription(
                seconds === 0
                    ? "✅ Slowmode has been disabled."
                    : `✅ Slowmode has been set to **${seconds}** second(s).`
            )
            .addFields({
                name: "Moderator",
                value: interaction.user.tag
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
