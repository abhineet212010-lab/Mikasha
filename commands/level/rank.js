const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/user");

module.exports = {
    name: "rank",

    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("Shows your level and XP.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a user")
                .setRequired(false)
        ),

    async execute(interaction) {

        const target = interaction.options.getUser("user") || interaction.user;

        let data = await User.findOne({
            guildId: interaction.guild.id,
            userId: target.id
        });

        if (!data) {
            data = await User.create({
                guildId: interaction.guild.id,
                userId: target.id
            });
        }

        const neededXP = Math.max(1, (data.level || 1) * 100);

        const progress = Math.min(
            Math.floor(((data.xp || 0) / neededXP) * 10),
            10
        );

        const bar = "🟩".repeat(progress) + "⬜".repeat(10 - progress);

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🏅 Rank Card")
            .setThumbnail(
                target.displayAvatarURL({
                    dynamic: true,
                    size: 1024
                })
            )
            .addFields(
                {
                    name: "👤 User",
                    value: target.tag,
                    inline: true
                },
                {
                    name: "⭐ Level",
                    value: `${data.level || 0}`,
                    inline: true
                },
                {
                    name: "✨ XP",
                    value: `${data.xp || 0} / ${neededXP}`,
                    inline: true
                },
                {
                    name: "📊 Progress",
                    value: `${bar} (${Math.floor(((data.xp || 0) / neededXP) * 100)}%)`
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });

    }
};
