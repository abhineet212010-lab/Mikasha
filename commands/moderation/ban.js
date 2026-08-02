const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ban",

    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for ban")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const reason =
            interaction.options.getString("reason") || "No reason provided.";

        if (!member) {
            return interaction.reply({
                content: "❌ User not found.",
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content: "❌ I can't ban this member.",
                ephemeral: true
            });
        }

        await member.ban({ reason });

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setTitle("🔨 Member Banned")
            .addFields(
                {
                    name: "User",
                    value: `${member.user.tag}`,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: `${interaction.user.tag}`,
                    inline: true
                },
                {
                    name: "Reason",
                    value: reason
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};        try {
          await interaction.guild.members.unban(
            user.id,
            'Temporary ban duration expired'
          );
        } catch (error) {
          console.error(`Failed to unban ${user.tag}:`, error);
        }
      }, durationInMs);
    }
  },
};

function parseDuration(duration) {
  const days =
    (duration.match(/(\d+)d/) ? parseInt(duration.match(/(\d+)d/)[1], 10) : 0) *
    24 *
    60 *
    60 *
    1000;
  const hours =
    (duration.match(/(\d+)h/) ? parseInt(duration.match(/(\d+)h/)[1], 10) : 0) *
    60 *
    60 *
    1000;
  const minutes =
    (duration.match(/(\d+)m/) ? parseInt(duration.match(/(\d+)m/)[1], 10) : 0) *
    60 *
    1000;
  const seconds =
    (duration.match(/(\d+)s/) ? parseInt(duration.match(/(\d+)s/)[1], 10) : 0) *
    1000;

  return days + hours + minutes + seconds;
}
