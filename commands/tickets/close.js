const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-close",

    data: new SlashCommandBuilder()
        .setName("ticket-close")
        .setDescription("Close the current ticket.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This command can only be used in ticket channels.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔒 Ticket Closed")
            .setDescription(
                `This ticket will be deleted in **5 seconds**.\n\nClosed by **${interaction.user.tag}**`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        setTimeout(async () => {
            try {
                await interaction.channel.delete("Ticket Closed");
            } catch (err) {
                console.error(err);
            }
        }, 5000);
    }
};
