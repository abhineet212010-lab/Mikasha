const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

module.exports = {
    name: "clone",

    data: new SlashCommandBuilder()
        .setName("clone")
        .setDescription("Clone the current channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const channel = interaction.channel;

        if (channel.type !== ChannelType.GuildText) {
            return interaction.reply({
                content: "❌ This command can only be used in text channels.",
                ephemeral: true
            });
        }

        const cloned = await channel.clone({
            name: channel.name,
            reason: `Channel cloned by ${interaction.user.tag}`
        });

        await cloned.setParent(channel.parent);
        await cloned.setPosition(channel.position + 1);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📄 Channel Cloned")
            .setDescription(`Successfully cloned ${channel}.`)
            .addFields({
                name: "Moderator",
                value: interaction.user.tag
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await cloned.send({
            content: "✅ This channel is a clone of the previous one."
        });
    }
};
