const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "help",

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("View all Mikasa commands."),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#ff4d8d")
            .setTitle("🎀 Mikasa Help Menu")
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setDescription("Here are all available command categories.")

            .addFields(
                {
                    name: "🛡️ Moderation",
                    value:
"`/ban`\n`/kick`\n`/warn`\n`/timeout`\n`/unmute`\n`/purge`\n`/lock`\n`/unlock`\n`/hide`\n`/unhide`\n`/clone`"
                },

                {
                    name: "🎫 Tickets",
                    value:
"`/ticket-setup`\n`/ticket-close`\n`/ticket-delete`\n`/ticket-claim`\n`/ticket-add`\n`/ticket-remove`\n`/ticket-rename`\n`/ticket-transcript`"
                },

                {
                    name: "👋 Welcome",
                    value:
"`/welcome-setup`\n`/goodbye-setup`"
                },

                {
                    name: "🛡️ AutoMod",
                    value:
"`/automod-setup`\n`/automod-status`"
                },

                {
                    name: "📜 Logs",
                    value:
"`/logs-setup`"
                },

                {
                    name: "🛠️ Utility",
                    value:
"`/help`\n`/ping`\n`/botinfo`\n`/serverinfo`\n`/userinfo`\n`/avatar`\n`/banner`\n`/uptime`\n`/stats`"
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
