const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-claim",

    data: new SlashCommandBuilder()
        .setName("ticket-claim")
        .setDescription("Claim the current ticket.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This is not a ticket channel.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("👮 Ticket Claimed")
            .setDescription(
                `${interaction.user} has claimed this ticket.\nPlease wait while they assist you.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });
    }
};
