const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "poll-end",

    data: new SlashCommandBuilder()
        .setName("poll-end")
        .setDescription("End a poll.")
        .addStringOption(option =>
            option
                .setName("messageid")
                .setDescription("Poll message ID")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        const messageId = interaction.options.getString("messageid");

        let pollMessage;

        try {

            pollMessage = await interaction.channel.messages.fetch(messageId);

        } catch {

            return interaction.reply({
                content: "❌ Poll message not found.",
                ephemeral: true
            });

        }

        try {

            await pollMessage.reactions.removeAll();

        } catch {}

        const embed = EmbedBuilder.from(pollMessage.embeds[0])
            .setColor("#ED4245")
            .setFooter({
                text: `Poll ended by ${interaction.user.tag}`
            })
            .setTimestamp();

        await pollMessage.edit({
            embeds: [embed]
        });

        return interaction.reply({
            content: "✅ Poll ended successfully.",
            ephemeral: true
        });

    }
};
