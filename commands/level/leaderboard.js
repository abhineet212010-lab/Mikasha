const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
    name: "leaderboard",

    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("Shows the server XP leaderboard."),

    async execute(interaction) {

        const users = await User.find({
            guildId: interaction.guild.id
        })
        .sort({ level: -1, xp: -1 })
        .limit(10);

        if (!users.length) {
            return interaction.reply({
                content: "❌ No leaderboard data found.",
                ephemeral: true
            });
        }

        let description = "";

        for (let i = 0; i < users.length; i++) {

            const data = users[i];

            const member =
                await interaction.client.users
                    .fetch(data.userId)
                    .catch(() => null);

            description +=
`**#${i + 1}** ${
member ? member.tag : "Unknown User"
}
🏅 Level: **${data.level}**
✨ XP: **${data.xp}**

`;

        }

        const embed = new EmbedBuilder()
            .setColor("#FFD700")
            .setTitle("🏆 XP Leaderboard")
            .setDescription(description)
            .setFooter({
                text: `Requested by ${interaction.user.tag}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }
};      ctx.fillText(`${member.xp}`, 700, y);
    }

    // Convert canvas to buffer
    const buffer = await canvas.encode('png');

    // Send image
    const attachment = new AttachmentBuilder(buffer, {
      name: 'leaderboard.png',
    });

    await interaction.editReply({
      content: 'Here is the current leaderboard:',
      files: [attachment],
    });
  },
};
