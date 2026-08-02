const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "unlock",

    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const channel = interaction.channel;

        await channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: null
            }
        );

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🔓 Channel Unlocked")
            .setDescription(`${channel} has been unlocked.`)
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
