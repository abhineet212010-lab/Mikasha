const {
    SlashCommandBuilder,
    EmbedBuilder,
    version: djsVersion
} = require("discord.js");

const os = require("os");

module.exports = {
    name: "botinfo",

    data: new SlashCommandBuilder()
        .setName("botinfo")
        .setDescription("Shows information about Mikasa."),

    async execute(interaction) {

        const client = interaction.client;

        const uptime = client.uptime;

        const days = Math.floor(uptime / 86400000);
        const hours = Math.floor(uptime / 3600000) % 24;
        const minutes = Math.floor(uptime / 60000) % 60;
        const seconds = Math.floor(uptime / 1000) % 60;

        const memory = (
            process.memoryUsage().heapUsed /
            1024 /
            1024
        ).toFixed(2);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🤖 Mikasa Bot Information")
            .setThumbnail(client.user.displayAvatarURL())

            .addFields(

                {
                    name: "🤖 Bot",
                    value: client.user.tag,
                    inline: true
                },

                {
                    name: "👑 Developer",
                    value: "Abhineet Nayak",
                    inline: true
                },

                {
                    name: "🌍 Servers",
                    value: `${client.guilds.cache.size}`,
                    inline: true
                },

                {
                    name: "👥 Users",
                    value: `${client.users.cache.size}`,
                    inline: true
                },

                {
                    name: "📺 Channels",
                    value: `${client.channels.cache.size}`,
                    inline: true
                },

                {
                    name: "🏓 Ping",
                    value: `${client.ws.ping}ms`,
                    inline: true
                },

                {
                    name: "⏱️ Uptime",
                    value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
                    inline: true
                },

                {
                    name: "💻 Node.js",
                    value: process.version,
                    inline: true
                },

                {
                    name: "📦 Discord.js",
                    value: `v${djsVersion}`,
                    inline: true
                },

                {
                    name: "💾 RAM Usage",
                    value: `${memory} MB`,
                    inline: true
                },

                {
                    name: "🖥️ OS",
                    value: `${os.platform()} ${os.release()}`,
                    inline: true
                }

            )

            .setFooter({
                text: `Requested by ${interaction.user.tag}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }
};
