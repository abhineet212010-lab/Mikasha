const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/guild");

module.exports = {
    name: "automod-setup",

    data: new SlashCommandBuilder()
        .setName("automod-setup")
        .setDescription("Configure the Mikasa AutoMod system.")
        .addBooleanOption(option =>
            option
                .setName("antilink")
                .setDescription("Enable or disable Anti Link")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antiinvite")
                .setDescription("Enable or disable Anti Invite")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antispam")
                .setDescription("Enable or disable Anti Spam")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antibadwords")
                .setDescription("Enable or disable Anti Bad Words")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antimention")
                .setDescription("Enable or disable Anti Mention Spam")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const settings = {
            antiLink: interaction.options.getBoolean("antilink"),
            antiInvite: interaction.options.getBoolean("antiinvite"),
            antiSpam: interaction.options.getBoolean("antispam"),
            antiBadWords: interaction.options.getBoolean("antibadwords"),
            antiMention: interaction.options.getBoolean("antimention")
        };

        let guild = await Guild.findOne({
            guildId: interaction.guild.id
        });

        if (!guild) {
            guild = await Guild.create({
                guildId: interaction.guild.id
            });
        }

        guild.antiLink = settings.antiLink;
        guild.antiInvite = settings.antiInvite;
        guild.antiSpam = settings.antiSpam;
        guild.antiBadWords = settings.antiBadWords;
        guild.antiMention = settings.antiMention;

        await guild.save();

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🛡️ Mikasa AutoMod Configured")
            .setDescription("The AutoMod settings have been updated successfully.")
            .addFields(
                {
                    name: "🔗 Anti Link",
                    value: settings.antiLink ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "📨 Anti Invite",
                    value: settings.antiInvite ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "⚡ Anti Spam",
                    value: settings.antiSpam ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "🤬 Anti Bad Words",
                    value: settings.antiBadWords ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                },
                {
                    name: "👥 Anti Mention",
                    value: settings.antiMention ? "✅ Enabled" : "❌ Disabled",
                    inline: true
                }
            )
            .setFooter({
                text: `Configured by ${interaction.user.tag}`
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
