const { EmbedBuilder } = require("discord.js");
const Guild = require("../models/Guild");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {

        try {

            const data = await Guild.findOne({
                guildId: member.guild.id
            });

            if (!data || !data.goodbyeChannel) return;

            const channel = member.guild.channels.cache.get(data.goodbyeChannel);

            if (!channel) return;

            const embed = new EmbedBuilder()
                .setColor("#ED4245")
                .setTitle("👋 Member Left")
                .setDescription(
`**${member.user.tag}** has left **${member.guild.name}**.

📉 Members: **${member.guild.memberCount}**

We hope to see you again soon! ❤️`
                )
                .setThumbnail(
                    member.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setFooter({
                    text: "Mikasa Goodbye System"
                })
                .setTimestamp();

            await channel.send({
                embeds: [embed]
            });

        } catch (err) {
            console.error("Goodbye Error:", err);
        }

    }
};
