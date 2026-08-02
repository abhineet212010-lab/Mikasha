const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

module.exports = {
    name: "ticket-setup",

    data: new SlashCommandBuilder()
        .setName("ticket-setup")
        .setDescription("Setup the ticket panel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎫 Mikasa Support")
            .setDescription(
                "Need help?\n\nClick the button below to create a private support ticket.\n\nOur staff will assist you as soon as possible."
            )
            .setFooter({
                text: "Mikasa Support System"
            })
            .setTimestamp();

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("ticket_create")
                .setLabel("Create Ticket")
                .setEmoji("🎫")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            content: "✅ Ticket panel created.",
            ephemeral: true
        });

        await interaction.channel.send({
            embeds: [embed],
            components: [row]
        });
    }
};
