const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/Guild");

module.exports = {
    name: "automod-status",

    data: new SlashCommandBuilder()
        .setName("automod-status")
        .setDescription("View the current AutoMod settings.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        let data = await Guild.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            data = await Guild.create({
                guildId: interaction.guild.id
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🛡️ Mikasa AutoMod Status")
            .addFields(
                {
                    name: "🔗 Anti Link",
                    value: data.antiLink ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "📨 Anti Invite",
                    value: data.antiInvite ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "⚡ Anti Spam",
                    value: data.antiSpam ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "🤬 Anti Bad Words",
                    value: data.antiBadWords ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "👥 Anti Mention Spam",
                    value: data.antiMention ? "✅ Enabled" : "❌ Disabled",
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
