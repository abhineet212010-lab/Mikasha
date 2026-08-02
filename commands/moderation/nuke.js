const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "nuke",

    data: new SlashCommandBuilder()
        .setName("nuke")
        .setDescription("Clone and recreate the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const channel = interaction.channel;

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({
                content: "❌ This command can only be used in text channels.",
                ephemeral: true
            });
        }

        await interaction.reply({
            content: "💥 Nuking channel...",
            ephemeral: true
        });

        const cloned = await channel.clone({
            name: channel.name,
            reason: `Nuked by ${interaction.user.tag}`
        });

        await cloned.setPosition(channel.position);

        if (channel.parent)
            await cloned.setParent(channel.parent);

        await channel.delete();

        const embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("💥 Channel Nuked")
            .setDescription(
                "This channel has been recreated successfully."
            )
            .addFields(
                {
                    name: "Moderator",
                    value: interaction.user.tag
                }
            )
            .setTimestamp();

        await cloned.send({
            embeds: [embed]
        });
    }
};
