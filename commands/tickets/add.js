const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-add",

    data: new SlashCommandBuilder()
        .setName("ticket-add")
        .setDescription("Add a user to the current ticket.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to add")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This is not a ticket.",
                ephemeral: true
            });
        }

        const user = interaction.options.getUser("user");

        await interaction.channel.permissionOverwrites.create(user.id, {
            ViewChannel: true,
            SendMessages: true,
            ReadMessageHistory: true
        });

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("➕ User Added")
            .setDescription(`${user} has been added to this ticket.`)
            .setTimestamp();

        return interaction.reply({
            embeds: [embed]
        });
    }
};        content:
          '❌ You do not have permission to use ticket management commands!',
        ephemeral: true,
      });
    }

    switch (subcommand) {
      case 'close': {
        try {
          if (!interaction.channel.name.startsWith('ticket-')) {
            return interaction.reply({
              content: '❌ This command can only be used in ticket channels!',
              ephemeral: true,
            });
          }

          const reason =
            interaction.options.getString('reason') || 'No reason provided';

          await interaction.deferReply();
          await closeTicket(interaction.channel, interaction.user, reason);
        } catch (error) {
          console.error('Error in close command:', error);
          await interaction.editReply({
            content: `❌ Error: ${error.message}`,
            ephemeral: true,
          });
        }
        break;
      }

      case 'transfer': {
        if (!interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({
            content: '❌ This command can only be used in ticket channels!',
            ephemeral: true,
          });
        }

        await interaction.deferReply();

        const targetUser = interaction.options.getUser('user');
        const ticket = await Ticket.findOne({
          channelId: interaction.channel.id,
          status: 'open',
        });

        if (!ticket) {
          return interaction.editReply(
            '❌ No active ticket found for this channel.'
          );
        }

        const targetMember = await interaction.guild.members.fetch(
          targetUser.id
        );
        const hasPermission = settings.supportRoleIds.some((roleId) =>
          targetMember.roles.cache.has(roleId)
        );

        if (!hasPermission) {
          return interaction.editReply(
            '❌ You can only transfer tickets to support staff members!'
          );
        }

        if (ticket.claimedBy && ticket.claimedBy !== interaction.user.id) {
          const claimer = await interaction.client.users.fetch(
            ticket.claimedBy
          );
          return interaction.editReply(
            `❌ This ticket is claimed by ${claimer.tag}. Only they can transfer it.`
          );
        }

        ticket.claimedBy = targetUser.id;
        ticket.claimedAt = new Date();
        await ticket.save();

        const transferEmbed = new EmbedBuilder()
          .setColor('#FFA500')
          .setTitle('Ticket Transferred')
          .setDescription(
            `🔄 This ticket has been transferred to ${targetUser.toString()}`
          )
          .addFields(
            {
              name: 'From',
              value: interaction.user.toString(),
              inline: true,
            },
            {
              name: 'To',
              value: targetUser.toString(),
              inline: true,
            },
            {
              name: 'Ticket ID',
              value: ticket.ticketId,
              inline: true,
            }
          )
          .setTimestamp();

        const closeButton = new ButtonBuilder()
          .setCustomId('close_ticket')
          .setLabel('Close Ticket')
          .setStyle(ButtonStyle.Danger);

        const viewClaimButton = new ButtonBuilder()
          .setCustomId('view_claim')
          .setLabel(`Claimed by ${targetUser.username}`)
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(true);

        const row = new ActionRowBuilder().addComponents(
          viewClaimButton,
          closeButton
        );

        const messages = await interaction.channel.messages.fetch({
          limit: 10,
        });
        const claimMessage = messages.find(
          (m) =>
            m.author.id === interaction.client.user.id &&
            m.components.length > 0 &&
            m.components[0].components.some(
              (c) =>
                c.customId === 'claim_ticket' || c.customId === 'view_claim'
            )
        );

        if (claimMessage) {
          await claimMessage.edit({ components: [row] });
        }

        await interaction.editReply({ embeds: [transferEmbed] });

        if (settings.logChannelId) {
          const logChannel = interaction.guild.channels.cache.get(
            settings.logChannelId
          );
          if (logChannel) {
            await logChannel.send({ embeds: [transferEmbed] });
          }
        }
        break;
      }

      case 'ban': {
        const targetUser = interaction.options.getUser('user');
        const reason =
          interaction.options.getString('reason') || 'No reason provided';

        const existingBan = await TicketBan.findOne({
          guildId: interaction.guildId,
          userId: targetUser.id,
        });

        if (existingBan) {
          return interaction.reply({
            content: '❌ This user is already banned from creating tickets!',
            ephemeral: true,
          });
        }

        await TicketBan.create({
          guildId: interaction.guildId,
          userId: targetUser.id,
          reason: reason,
          moderatorId: interaction.user.id,
        });

        const banEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('Ticket Ban')
          .setDescription(
            `🚫 ${targetUser.toString()} has been banned from creating tickets`
          )
          .addFields(
            { name: 'Reason', value: reason, inline: true },
            {
              name: 'Moderator',
              value: interaction.user.toString(),
              inline: true,
            }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [banEmbed] });
        break;
      }

      case 'unban': {
        const targetUser = interaction.options.getUser('user');

        const existingBan = await TicketBan.findOneAndDelete({
          guildId: interaction.guildId,
          userId: targetUser.id,
        });

        if (!existingBan) {
          return interaction.reply({
            content: '❌ This user is not banned from creating tickets!',
            ephemeral: true,
          });
        }

        const unbanEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('Ticket Unban')
          .setDescription(
            `✅ ${targetUser.toString()} has been unbanned from creating tickets`
          )
          .addFields({
            name: 'Moderator',
            value: interaction.user.toString(),
            inline: true,
          })
          .setTimestamp();

        await interaction.reply({ embeds: [unbanEmbed] });
        break;
      }

      case 'add': {
        if (!interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({
            content: '❌ This command can only be used in ticket channels!',
            ephemeral: true,
          });
        }

        const targetUser = interaction.options.getUser('user');
        const ticket = await Ticket.findOne({
          channelId: interaction.channel.id,
          status: 'open',
        });

        if (!ticket) {
          return interaction.reply({
            content: '❌ No active ticket found for this channel!',
            ephemeral: true,
          });
        }

        if (
          interaction.channel
            .permissionsFor(targetUser)
            ?.has(PermissionFlagsBits.ViewChannel)
        ) {
          return interaction.reply({
            content: '❌ This user already has access to the ticket!',
            ephemeral: true,
          });
        }

        await interaction.channel.permissionOverwrites.edit(targetUser, {
          ViewChannel: true,
          SendMessages: true,
          ReadMessageHistory: true,
        });

        const addEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle('User Added to Ticket')
          .setDescription(
            `✅ ${targetUser.toString()} has been added to the ticket by ${interaction.user.toString()}`
          )
          .setTimestamp();

        await interaction.reply({ embeds: [addEmbed] });
        break;
      }

      case 'remove': {
        if (!interaction.channel.name.startsWith('ticket-')) {
          return interaction.reply({
            content: '❌ This command can only be used in ticket channels!',
            ephemeral: true,
          });
        }

        const targetUser = interaction.options.getUser('user');
        const ticket = await Ticket.findOne({
          channelId: interaction.channel.id,
          status: 'open',
        });

        if (!ticket) {
          return interaction.reply({
            content: '❌ No active ticket found for this channel!',
            ephemeral: true,
          });
        }

        if (targetUser.id === ticket.userId) {
          return interaction.reply({
            content: '❌ You cannot remove the ticket creator!',
            ephemeral: true,
          });
        }

        if (
          !interaction.channel
            .permissionsFor(targetUser)
            ?.has(PermissionFlagsBits.ViewChannel)
        ) {
          return interaction.reply({
            content: '❌ This user does not have access to the ticket!',
            ephemeral: true,
          });
        }

        await interaction.channel.permissionOverwrites.delete(targetUser);

        const removeEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle('User Removed from Ticket')
          .setDescription(
            `❌ ${targetUser.toString()} has been removed from the ticket by ${interaction.user.toString()}`
          )
          .setTimestamp();

        await interaction.reply({ embeds: [removeEmbed] });
        break;
      }
    }
  },
};
