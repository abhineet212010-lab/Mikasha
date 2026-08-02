const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-remove",

    data: new SlashCommandBuilder()
        .setName("ticket-remove")
        .setDescription("Remove a user from the current ticket.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to remove")
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

        const user = interaction.options.getUser("user");

        await interaction.channel.permissionOverwrites.delete(user.id);

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("➖ User Removed")
            .setDescription(`${user} has been removed from this ticket.`)
            .addFields({
                name: "Removed By",
                value: interaction.user.tag
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
