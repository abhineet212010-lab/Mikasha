const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const Guild = require("../../models/guild");

module.exports = {
    name: "logs-setup",

    data: new SlashCommandBuilder()
        .setName("logs-setup")
        .setDescription("Setup the server logs channel.")
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Logs channel")
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

        data.logChannel = channel.id;
        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📜 Logs Configured")
            .setDescription(`Logs channel has been set to <#${channel.id}>.`)
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
