const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "hide",

    data: new SlashCommandBuilder()
        .setName("hide")
        .setDescription("Hide the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                ViewChannel: false
            }
        );

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🙈 Channel Hidden")
            .setDescription(`${interaction.channel} is now hidden.`)
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
