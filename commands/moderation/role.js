const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "role",

    data: new SlashCommandBuilder()
        .setName("role")
        .setDescription("Add or remove a role from a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select a member")
                .setRequired(true)
        )
        .addRoleOption(option =>
            option
                .setName("role")
                .setDescription("Select a role")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    async execute(interaction) {

        const member = interaction.options.getMember("user");
        const role = interaction.options.getRole("role");

        if (!member) {
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });
        }

        if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageRoles)) {
            return interaction.reply({
                content: "❌ I don't have Manage Roles permission.",
                ephemeral: true
            });
        }

        if (role.position >= interaction.guild.members.me.roles.highest.position) {
            return interaction.reply({
                content: "❌ That role is higher than my highest role.",
                ephemeral: true
            });
        }

        let action;

        if (member.roles.cache.has(role.id)) {
            await member.roles.remove(role);
            action = "Removed";
        } else {
            await member.roles.add(role);
            action = "Added";
        }

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎭 Role Updated")
            .addFields(
                {
                    name: "Member",
                    value: member.user.tag,
                    inline: true
                },
                {
                    name: "Role",
                    value: role.name,
                    inline: true
                },
                {
                    name: "Action",
                    value: action,
                    inline: true
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag
                }
            )
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};
