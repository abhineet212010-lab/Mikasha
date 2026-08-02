const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-rename",

    data: new SlashCommandBuilder()
        .setName("ticket-rename")
        .setDescription("Rename the current ticket channel.")
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("New ticket name")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This is not a ticket channel.",
                ephemeral: true
            });
        }

        const name = interaction.options.getString("name");

        await interaction.channel.setName(
            `ticket-${name.toLowerCase().replace(/\s+/g, "-")}`
        );

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("✏️ Ticket Renamed")
            .setDescription(
                `Ticket name changed to **${name}**`
            )
            .addFields({
                name: "Changed By",
                value: interaction.user.tag
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
