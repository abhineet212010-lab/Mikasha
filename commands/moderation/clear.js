const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "clear",

    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Delete multiple messages.")
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("Number of messages to delete (1-100)")
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        const amount = interaction.options.getInteger("amount");

        try {
            await interaction.channel.bulkDelete(amount, true);

            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("🧹 Messages Cleared")
                .setDescription(`Successfully deleted **${amount}** messages.`)
                .setFooter({
                    text: `Action by ${interaction.user.tag}`
                })
                .setTimestamp();

            await interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        } catch (err) {
            console.error(err);

            await interaction.reply({
                content: "❌ Unable to delete messages. Messages older than 14 days cannot be bulk deleted.",
                ephemeral: true
            });
        }
    }
};
