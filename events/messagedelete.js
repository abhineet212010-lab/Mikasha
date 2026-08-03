const { EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

module.exports = {
    name: "messageDelete",

    async execute(message) {

        if (!message.guild) return;
        if (message.author?.bot) return;

        try {

            const data = await Guild.findOne({
                guildId: message.guild.id
            });

            if (!data || !data.logChannel) return;

            const logChannel = message.guild.channels.cache.get(data.logChannel);

            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("🗑️ Message Deleted")
                .addFields(
                    {
                        name: "👤 Author",
                        value: `${message.author.tag} (${message.author.id})`
                    },
                    {
                        name: "📍 Channel",
                        value: `${message.channel}`
                    },
                    {
                        name: "💬 Content",
                        value: message.content || "*No text content*"
                    }
                )
                .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error("Message Delete Log Error:", err);
        }

    }
};
