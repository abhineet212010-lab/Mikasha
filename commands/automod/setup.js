const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/Guild");

module.exports = {
    name: "automod-setup",

    data: new SlashCommandBuilder()
        .setName("automod-setup")
        .setDescription("Configure Mikasa AutoMod.")
        .addBooleanOption(option =>
            option
                .setName("antilink")
                .setDescription("Enable Anti Link")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antiinvite")
                .setDescription("Enable Anti Invite")
                .setRequired(true)
        )
        .addBooleanOption(option =>
            option
                .setName("antispam")
                .setDescription("Enable Anti Spam")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const antilink = interaction.options.getBoolean("antilink");
        const antiinvite = interaction.options.getBoolean("antiinvite");
        const antispam = interaction.options.getBoolean("antispam");

        let data = await Guild.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            data = await Guild.create({
                guildId: interaction.guild.id
            });
        }

        data.antiLink = antilink;
        data.antiInvite = antiinvite;
        data.antiSpam = antispam;

        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🛡️ AutoMod Configured")
            .addFields(
                {
                    name: "🔗 Anti Link",
                    value: antilink ? "Enabled ✅" : "Disabled ❌",
                    inline: true
                },
                {
                    name: "📨 Anti Invite",
                    value: antiinvite ? "Enabled ✅" : "Disabled ❌",
                    inline: true
                },
                {
                    name: "⚡ Anti Spam",
                    value: antispam ? "Enabled ✅" : "Disabled ❌",
                    inline: true
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
