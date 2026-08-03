const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "unban",

    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server.")
        .addStringOption(option =>
            option
                .setName("userid")
                .setDescription("User ID to unban")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const userId = interaction.options.getString("userid");

        try {
            const bans = await interaction.guild.bans.fetch();
            const bannedUser = bans.get(userId) || bans.find(b => b.user && b.user.id === userId);

            if (!bannedUser) {
                return interaction.reply({
                    content: "❌ This user is not banned.",
                    ephemeral: true
                });
            }

            await interaction.guild.members.unban(userId);

            const embed = new EmbedBuilder()
                .setColor("#57F287")
                .setTitle("🔓 Member Unbanned")
                .addFields(
                    {
                        name: "User",
                        value: bannedUser.user ? `${bannedUser.user.tag}` : `${userId}`,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: interaction.user.tag,
                        inline: true
                    }
                )
                .setTimestamp();

            return interaction.reply({
                embeds: [embed]
            });

        } catch (err) {
            console.error('Unban command error:', err);

            return interaction.reply({
                content: `❌ Failed to unban user: ${err.message || err}`,
                ephemeral: true
            });
        }

    }
};
