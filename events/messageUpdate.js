const { EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

module.exports = {
    name: "messageUpdate",

    async execute(oldMessage, newMessage) {

        if (!oldMessage.guild) return;
        if (oldMessage.author?.bot) return;

        if (oldMessage.content === newMessage.content) return;

        try {

            const data = await Guild.findOne({
                guildId: oldMessage.guild.id
            });

            if (!data || !data.logChannel) return;

            const logChannel = oldMessage.guild.channels.cache.get(data.logChannel);

            if (!logChannel) return;

            const embed = new EmbedBuilder()
                .setColor("#FEE75C")
                .setTitle("✏️ Message Edited")
                .addFields(
                    {
                        name: "👤 Author",
                        value: `${oldMessage.author.tag} (${oldMessage.author.id})`
                    },
                    {
                        name: "📍 Channel",
                        value: `${oldMessage.channel}`
                    },
                    {
                        name: "📝 Before",
                        value: oldMessage.content || "*No Text*"
                    },
                    {
                        name: "📄 After",
                        value: newMessage.content || "*No Text*"
                    }
                )
                .setTimestamp();

            await logChannel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error("Message Update Log Error:", err);
        }

    }
};
