const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

module.exports = {
    name: "guildBanAdd",

    async execute(ban) {

        try {

            const data = await Guild.findOne({
                guildId: ban.guild.id
            });

            if (!data || !data.logChannel) return;

            const logChannel = ban.guild.channels.cache.get(data.logChannel);

            if (!logChannel) return;

            const logs = await ban.guild.fetchAuditLogs({
                limit: 1,
                type: AuditLogEvent.MemberBanAdd
            });

            const entry = logs.entries.first();

            const moderator = entry?.executor
                ? `${entry.executor.tag} (${entry.executor.id})`
                : "Unknown";

            const reason = entry?.reason || "No reason provided.";

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("🔨 Member Banned")
                .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {
                        name: "👤 User",
                        value: `${ban.user.tag}\n(${ban.user.id})`
                    },
                    {
                        name: "👮 Moderator",
                        value: moderator
                    },
                    {
                        name: "📝 Reason",
                        value: reason
                    }
                )
                .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error("Guild Ban Log Error:", err);
        }

    }
};
