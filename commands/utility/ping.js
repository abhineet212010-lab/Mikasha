const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ping",

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot latency."),

    async execute(interaction) {

        const sent = await interaction.reply({
            content: "🏓 Pinging...",
            fetchReply: true
        });

        const apiPing = Math.round(interaction.client.ws.ping);
        const botPing = sent.createdTimestamp - interaction.createdTimestamp;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🏓 Pong!")
            .addFields(
                {
                    name: "🤖 Bot Latency",
                    value: `${botPing}ms`,
                    inline: true
                },
                {
                    name: "🌐 API Latency",
                    value: `${apiPing}ms`,
                    inline: true
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`
            })
            .setTimestamp();

        await interaction.editReply({
            content: "",
            embeds: [embed]
        });
    }
};
