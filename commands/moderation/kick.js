const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "kick",

    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for kick")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

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

        if (!member.kickable) {
            return interaction.reply({
                content: "❌ I can't kick this member.",
                ephemeral: true
            });
        }

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor("#ffaa00")
            .setTitle("👢 Member Kicked")
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
};
