const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/Guild");

module.exports = {
    name: "welcome-setup",

    data: new SlashCommandBuilder()
        .setName("welcome-setup")
        .setDescription("Setup welcome channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Welcome channel")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const channel = interaction.options.getChannel("channel");

        let data = await Guild.findOne({
            guildId: interaction.guild.id
        });

        if (!data) {
            data = await Guild.create({
                guildId: interaction.guild.id
            });
        }

        data.welcomeChannel = channel.id;
        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#ff4d6d")
            .setTitle("👋 Welcome System Enabled")
            .setDescription(
                `Welcome messages will now be sent in ${channel}`
            )
            .addFields({
                name: "Setup By",
                value: interaction.user.tag
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
