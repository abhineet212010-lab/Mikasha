const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {

    name: "ping",
    aliases: ["p"],

    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Shows the bot latency."),

    async execute(ctx, args, client) {

        const interaction = ctx.isChatInputCommand?.();

        const embed = new EmbedBuilder()
            .setColor(process.env.DEFAULT_COLOR || "#ff4d6d")
            .setTitle("🏓 Pong!")
            .addFields(
                {
                    name: "Bot Ping",
                    value: `${client.ws.ping}ms`,
                    inline: true
                },
                {
                    name: "Status",
                    value: "🟢 Online",
                    inline: true
                }
            )
            .setTimestamp();

        if (interaction) {
            return ctx.reply({ embeds: [embed] });
        }

        return ctx.reply({ embeds: [embed] });
    }
};
