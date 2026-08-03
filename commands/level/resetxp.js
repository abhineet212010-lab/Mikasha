const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/user");

module.exports = {
    name: "resetxp",

    data: new SlashCommandBuilder()
        .setName("resetxp")
        .setDescription("Reset a user's XP and level.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a user")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const target = interaction.options.getUser("user");

        let data = await User.findOne({
            guildId: interaction.guild.id,
            userId: target.id
        });

        if (!data) {

            return interaction.reply({
                content: "❌ This user has no XP data.",
                ephemeral: true
            });

        }

        data.level = 1;
        data.xp = 0;

        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("🔄 XP Reset")
            .setDescription(
                `Successfully reset **${target.tag}**'s XP and Level.`
            )
            .addFields(
                {
                    name: "⭐ New Level",
                    value: "1",
                    inline: true
                },
                {
                    name: "✨ New XP",
                    value: "0",
                    inline: true
                }
            )
            .setThumbnail(
                target.displayAvatarURL({
                    dynamic: true
                })
            )
            .setFooter({
                text: `Reset by ${interaction.user.tag}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }
};
