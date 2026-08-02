const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const ms = require("ms");

module.exports = {
    name: "tempban",

    data: new SlashCommandBuilder()
        .setName("tempban")
        .setDescription("Temporarily ban a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Example: 10m, 1h, 7d")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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

        if (!member.bannable) {
            return interaction.reply({
                content: "❌ I can't ban this member.",
                ephemeral: true
            });
        }

        const time = ms(duration);

        if (!time) {
            return interaction.reply({
                content: "❌ Invalid duration. Example: 10m, 1h, 7d",
                ephemeral: true
            });
        }

        await member.ban({ reason });

        setTimeout(async () => {
            try {
                await interaction.guild.members.unban(member.id, "Temporary ban expired");
            } catch (err) {
                console.error(err);
            }
        }, time);

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("⏳ Temporary Ban")
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
