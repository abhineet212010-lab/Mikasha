const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "nickname",

    data: new SlashCommandBuilder()
        .setName("nickname")
        .setDescription("Change a member's nickname.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a member")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("nickname")
                .setDescription("New nickname")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const nickname = interaction.options.getString("nickname");

        if (!member) {
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });
        }

        if (!member.manageable) {
            return interaction.reply({
                content: "❌ I can't change this member's nickname.",
                ephemeral: true
            });
        }

        await member.setNickname(nickname);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("✏️ Nickname Updated")
            .addFields(
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: "New Nickname",
                    value: nickname,
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
