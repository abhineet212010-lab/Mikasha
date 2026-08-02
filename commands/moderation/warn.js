const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const User = require("../../models/User");

module.exports = {
    name: "warn",

    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to warn")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for warning")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const reason =
            interaction.options.getString("reason") || "No reason provided.";

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
            data = await User.create({
                userId: member.id,
                guildId: interaction.guild.id
            });
        }

        data.warns += 1;
        await data.save();

        const embed = new EmbedBuilder()
            .setColor("#ff9900")
            .setTitle("⚠️ Member Warned")
            .addFields(
                {
                    name: "
