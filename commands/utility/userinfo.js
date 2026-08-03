const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "userinfo",

    data: new SlashCommandBuilder()
        .setName("userinfo")
        .setDescription("Shows information about a user.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a user")
                .setRequired(false)
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user") || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);

        const roles = member.roles.cache
            .filter(role => role.id !== interaction.guild.id)
            .map(role => role.toString())
            .slice(0, 10)
            .join(", ") || "None";

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("👤 User Information")
            .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))

            .addFields(
                {
                    name: "👤 Username",
                    value: `${user.tag}`,
                    inline: true
                },
                {
                    name: "🆔 User ID",
                    value: user.id,
                    inline: true
                },
                {
                    name: "🤖 Bot",
                    value: user.bot ? "Yes" : "No",
                    inline: true
                },
                {
                    name: "🏷️ Nickname",
                    value: member.nickname || "None",
                    inline: true
                },
                {
                    name: "🎭 Highest Role",
                    value: member.roles.highest.toString(),
                    inline: true
                },
                {
                    name: "🎨 Role Color",
                    value: member.displayHexColor,
                    inline: true
                },
                {
                    name: "📅 Account Created",
                    value: `<t:${Math.floor(user.createdTimestamp / 1000)}:F>`
                },
                {
                    name: "📥 Joined Server",
                    value: `<t:${Math.floor(member.joinedTimestamp / 1000)}:F>`
                },
                {
                    name: "🎭 Roles",
                    value: roles
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
