const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    AttachmentBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-transcript",

    data: new SlashCommandBuilder()
        .setName("ticket-transcript")
        .setDescription("Create a transcript of the ticket.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This is not a ticket channel.",
                ephemeral: true
            });
        }

        await interaction.deferReply({
            ephemeral: true
        });

        try {

            const messages = await interaction.channel.messages.fetch({
                limit: 100
            });

            const sorted = messages
                .sort((a, b) => a.createdTimestamp - b.createdTimestamp);

            let transcript = `
Mikasa Ticket Transcript
Channel: ${interaction.channel.name}
Created: ${new Date().toLocaleString()}

---------------------------------

`;

            sorted.forEach(msg => {

                transcript += 
`${msg.author.tag} | ${msg.createdAt.toLocaleString()}

${msg.content || "[No Text]"}

---------------------------------

`;

            });


            const file = Buffer.from(transcript, "utf-8");

            const attachment = new AttachmentBuilder(file, {
                name: `${interaction.channel.name}-transcript.txt`
            });


            await interaction.editReply({
                content: "✅ Transcript created successfully.",
                files: [attachment]
            });


        } catch (error) {

            console.error(error);

            await interaction.editReply({
                content: "❌ Failed to create transcript."
            });

        }
    }
};
