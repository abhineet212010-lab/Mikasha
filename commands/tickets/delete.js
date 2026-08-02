const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

module.exports = {
    name: "ticket-delete",

    data: new SlashCommandBuilder()
        .setName("ticket-delete")
        .setDescription("Delete the current ticket.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        if (!interaction.channel.name.startsWith("ticket-")) {
            return interaction.reply({
                content: "❌ This command can only be used inside a ticket.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🗑️ Ticket Deleted")
            .setDescription(
                `This ticket will be permanently deleted in **5 seconds**.\n\nDeleted by **${interaction.user.tag}**`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        setTimeout(async () => {
            try {
                await interaction.channel.delete("Ticket deleted");
            } catch (err) {
                console.error(err);
            }
        }, 5000);
    }
};          await interaction.reply({
            content: `✅ Removed ticket category: ${name}`,
            ephemeral: true,
          });
          break;
        }
        case 'list': {
          const categories = await TicketCategory.find({
            guildId: interaction.guildId,
          });

          if (categories.length === 0) {
            return interaction.reply({
              content:
                '❌ No ticket categories found! Create some using `/ticketcategory add`',
              ephemeral: true,
            });
          }

          const embed = new EmbedBuilder()
            .setTitle('Ticket Categories')
            .setColor('#DDA0DD')
            .setDescription(
              categories
                .map(
                  (cat) => `${cat.emoji} **${cat.name}**\n${cat.description}`
                )
                .join('\n\n')
            );

          await interaction.reply({
            embeds: [embed],
            ephemeral: true,
          });
          break;
        }
      }
    } catch (error) {
      console.error('Error managing ticket categories:', error);
      await interaction.reply({
        content: '❌ An error occurred while managing ticket categories.',
        ephemeral: true,
      });
    }
  },
};
