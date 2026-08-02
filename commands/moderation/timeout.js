const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const ms = require("ms");

module.exports = {
    name: "timeout",

    data: new SlashCommandBuilder()
        .setName("timeout")
        .setDescription("Timeout a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to timeout")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Example: 10m, 1h, 1d")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const duration = interaction.options.getString("duration");
        const reason = interaction.options.getString("reason") || "No reason provided.";

        if (!member) {
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ I can't timeout this member.",
                ephemeral: true
            });
        }

        const time = ms(duration);

        if (!time) {
            return interaction.reply({
                content: "❌ Invalid duration. Example: 10m, 1h, 1d",
                ephemeral: true
            });
        }

        await member.timeout(time, reason);

        const embed = new EmbedBuilder()
            .setColor("#ff9900")
            .setTitle("⏳ Member Timed Out")
            .addFields(
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: "Duration",
                    value: duration,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag,
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
};
