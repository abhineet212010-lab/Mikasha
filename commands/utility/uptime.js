const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "uptime",

    data: new SlashCommandBuilder()
        .setName("uptime")
        .setDescription("Shows the bot uptime."),

    async execute(interaction) {

        const uptime = interaction.client.uptime;

        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor((uptime % 86400000) / 3600000);
        const minutes = Math.floor((uptime % 3600000) / 60000);
        const seconds = Math.floor((uptime % 60000) / 1000);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("⏱️ Mikasa Uptime")
            .setDescription(
                `**${days}d ${hours}h ${minutes}m ${seconds}s**`
            )
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
