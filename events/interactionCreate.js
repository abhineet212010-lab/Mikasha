const {
    ChannelType,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
    name: "interactionCreate",

    async execute(interaction, client) {

        /* ==========================
           Slash Commands
        ========================== */

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                if (interaction.replied || interaction.deferred) {
                    interaction.followUp({
                        content: "❌ An error occurred.",
                        ephemeral: true
                    });
                } else {
                    interaction.reply({
                        content: "❌ An error occurred.",
                        ephemeral: true
                    });
                }
            }

            return;
        }

        /* ==========================
           Ticket Create
        ========================== */

        if (interaction.isButton()) {

            if (interaction.customId === "ticket_create") {

                const existing = interaction.guild.channels.cache.find(c =>
                    c.name === `ticket-${interaction.user.id}`
                );

                if (existing) {
                    return interaction.reply({
                        content: `❌ You already have a ticket: ${existing}`,
                        ephemeral: true
                    });
                }

                const channel = await interaction.guild.channels.create({
                    name: `ticket-${interaction.user.username}`,
                    type: ChannelType.GuildText,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.roles.everyone,
                            deny: [PermissionFlagsBits.ViewChannel]
                        },
                        {
                            id: interaction.user.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ReadMessageHistory
                            ]
                        },
                        {
                            id: interaction.guild.members.me.id,
                            allow: [
                                PermissionFlagsBits.ViewChannel,
                                PermissionFlagsBits.SendMessages,
                                PermissionFlagsBits.ManageChannels
                            ]
                        }
                    ]
                });

                await interaction.reply({
                    content: `✅ Ticket created: ${channel}`,
                    ephemeral: true
                });

                await channel.send({
                    content:
`🎫 Welcome ${interaction.user}

Please explain your issue.
A staff member will assist you shortly.`
                });
            }
        }

    }
};
