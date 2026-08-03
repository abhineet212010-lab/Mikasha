const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "poll-results",

    data: new SlashCommandBuilder()
        .setName("poll-results")
        .setDescription("View the results of a poll.")
        .addStringOption(option =>
            option
                .setName("messageid")
                .setDescription("Poll message ID")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        const messageId = interaction.options.getString("messageid");

        let pollMessage;

        try {
            pollMessage = await interaction.channel.messages.fetch(messageId);
        } catch {
            return interaction.reply({
                content: "❌ Poll message not found.",
                ephemeral: true
            });
        }

        const reactions = pollMessage.reactions.cache;

        if (!reactions.size) {
            return interaction.reply({
                content: "❌ No votes found.",
                ephemeral: true
            });
        }

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

        let description = "";
        let winner = null;
        let highestVotes = -1;
        let totalVotes = 0;

        reactions.forEach(reaction => {

            if (!emojis.includes(reaction.emoji.name)) return;

            const votes = Math.max(reaction.count - 1, 0);

            totalVotes += votes;

            description += `${reaction.emoji.name} • **${votes}** vote(s)\n`;

            if (votes > highestVotes) {
                highestVotes = votes;
                winner = reaction.emoji.name;
            }

        });

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("📊 Poll Results")
            .setDescription(description || "No votes.")
            .addFields(
                {
                    name: "🏆 Winner",
                    value: winner || "No winner",
                    inline: true
                },
                {
                    name: "🗳️ Total Votes",
                    value: `${totalVotes}`,
                    inline: true
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

    }
};
