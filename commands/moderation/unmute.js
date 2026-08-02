const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "unmute",

    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Remove timeout from a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to unmute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const member = interaction.options.getMember("user");

        if (!member) {
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ I can't unmute this member.",
                ephemeral: true
            });
        }

        await member.timeout(null);

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🔊 Member Unmuted")
            .addFields(
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag,
                    inline: true
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
