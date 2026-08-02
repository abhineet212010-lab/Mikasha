const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
    name: "warnings",

    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("View a member's warnings.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member")
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

        let data = await User.findOne({
            userId: member.id,
            guildId: interaction.guild.id
        });

        if (!data) {
            data = {
                warns: 0
            };
        }

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📋 Warning Information")
            .setThumbnail(member.user.displayAvatarURL())
            .addFields(
                {
                    name: "👤 Member",
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: "⚠️ Total Warnings",
                    value: `${data.warns}`,
                    inline: true
                }
            )
            .setFooter({
                text: `Requested by ${interaction.user.tag}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
