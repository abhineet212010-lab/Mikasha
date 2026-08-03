const { AuditLogEvent, EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

module.exports = {
    name: "guildBanRemove",

    async execute(ban) {

        try {

            const data = await Guild.findOne({
                guildId: ban.guild.id
            });

            if (!data || !data.logChannel) return;

            const logChannel = ban.guild.channels.cache.get(data.logChannel);

            if (!logChannel) return;

            const logs = await ban.guild.fetchAuditLogs({
                type: AuditLogEvent.MemberBanRemove,
                limit: 1
            });

            const entry = logs.entries.first();

            const moderator = entry?.executor
                ? `${entry.executor.tag} (${entry.executor.id})`
                : "Unknown";

            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("🔓 Member Unbanned")
                .setThumbnail(
                    ban.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .addFields(
                    {
                        name: "👤 User",
                        value: `${ban.user.tag}\n(${ban.user.id})`
                    },
                    {
                        name: "👮 Moderator",
                        value: moderator
                    }
                )
                .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error("Guild Unban Log Error:", err);
        }

    }
};
