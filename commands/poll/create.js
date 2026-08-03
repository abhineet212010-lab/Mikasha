const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "poll-create",

    data: new SlashCommandBuilder()
        .setName("poll-create")
        .setDescription("Create a poll.")
        .addStringOption(option =>
            option
                .setName("question")
                .setDescription("Poll question")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("option1")
                .setDescription("First option")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("option2")
                .setDescription("Second option")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("option3")
                .setDescription("Third option")
                .setRequired(false)
        )
        .addStringOption(option =>
            option
                .setName("option4")
                .setDescription("Fourth option")
                .setRequired(false)
        ),

    async execute(interaction) {

        const question = interaction.options.getString("question");

        const options = [
            interaction.options.getString("option1"),
            interaction.options.getString("option2"),
            interaction.options.getString("option3"),
            interaction.options.getString("option4")
        ].filter(Boolean);

        const emojis = ["1️⃣", "2️⃣", "3️⃣", "4️⃣"];

        let description = "";

        options.forEach((option, index) => {
            description += `${emojis[index]} ${option}\n`;
        });

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("📊 New Poll")
            .setDescription(`**${question}**\n\n${description}`)
            .setFooter({
                text: `Poll by ${interaction.user.tag}`
            })
            .setTimestamp();

        const msg = await interaction.reply({
            embeds: [embed],
            fetchReply: true
        });

        for (let i = 0; i < options.length; i++) {
            await msg.react(emojis[i]);
        }

    }
};
