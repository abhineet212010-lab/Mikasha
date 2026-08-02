const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "lock",

    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const channel = interaction.channel;

        await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: false
            }
        );

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔒 Channel Locked")
            .setDescription(`${channel} has been locked.`)
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
