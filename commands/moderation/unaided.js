const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "unhide",

    data: new SlashCommandBuilder()
        .setName("unhide")
        .setDescription("Unhide the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                ViewChannel: null
            }
        );

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("👀 Channel Unhidden")
            .setDescription(`${interaction.channel} is now visible to everyone.`)
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
