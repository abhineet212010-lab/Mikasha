const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "serverinfo",

    data: new SlashCommandBuilder()
        .setName("serverinfo")
        .setDescription("Shows information about the server."),

    async execute(interaction) {

        const guild = interaction.guild;

        const owner = await guild.fetchOwner();

        const humans = guild.members.cache.filter(m => !m.user.bot).size;
        const bots = guild.members.cache.filter(m => m.user.bot).size;

        const textChannels = guild.channels.cache.filter(c => c.type === 0).size;
        const voiceChannels = guild.channels.cache.filter(c => c.type === 2).size;
        const categories = guild.channels.cache.filter(c => c.type === 4).size;

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(`🏠 ${guild.name}`)
            .setThumbnail(guild.iconURL({ dynamic: true }))

            .addFields(
                {
                    name: "🆔 Server ID",
                    value: guild.id,
                    inline: true
                },
                {
                    name: "👑 Owner",
                    value: owner.user.tag,
                    inline: true
                },
                {
                    name: "👥 Members",
                    value: `${guild.memberCount}`,
                    inline: true
                },
                {
                    name: "🙋 Humans",
                    value: `${humans}`,
                    inline: true
                },
                {
                    name: "🤖 Bots",
                    value: `${bots}`,
                    inline: true
                },
                {
                    name: "🎭 Roles",
                    value: `${guild.roles.cache.size}`,
                    inline: true
                },
                {
                    name: "💬 Text Channels",
                    value: `${textChannels}`,
                    inline: true
                },
                {
                    name: "🔊 Voice Channels",
                    value: `${voiceChannels}`,
                    inline: true
                },
                {
                    name: "📂 Categories",
                    value: `${categories}`,
                    inline: true
                },
                {
                    name: "😀 Emojis",
                    value: `${guild.emojis.cache.size}`,
                    inline: true
                },
                {
                    name: "🚀 Boost Level",
                    value: `${guild.premiumTier}`,
                    inline: true
                },
                {
                    name: "💎 Boost Count",
                    value: `${guild.premiumSubscriptionCount}`,
                    inline: true
                },
                {
                    name: "📅 Created",
                    value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:F>`
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
