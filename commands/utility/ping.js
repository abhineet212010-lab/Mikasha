const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Check bot latency."),

    name: "ping",

    async execute(interaction, client) {
        const msg = await interaction.reply({
            content: "🏓 Pinging...",
            fetchReply: true
        });

        const latency = msg.createdTimestamp - interaction.createdTimestamp;

        await interaction.editReply({
            content:
`🏓 **Pong!**

🤖 Bot Ping: **${latency}ms**
🌐 API Ping: **${client.ws.ping}ms**`
        });
    }
};
