const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/Guild");

module.exports = {
    name: "goodbye-setup",

    data: new SlashCommandBuilder()
        .setName("goodbye-setup")
        .setDescription("Setup the goodbye channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Goodbye channel")
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

        data.goodbyeChannel = channel.id;
        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("👋 Goodbye System Enabled")
            .setDescription(
                `Goodbye messages will now be sent in ${channel}.`
            )
            .addFields({
                name: "Configured By",
                value: interaction.user.tag
            })
            .setTimestamp();

        return interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};
