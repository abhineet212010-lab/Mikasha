module.exports = {
  name: "interactionCreate",

  async execute(interaction, client) {
    // Sirf Slash Commands handle karega
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      return interaction.reply({
        content: "❌ Command not found.",
        ephemeral: true
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: "❌ An unexpected error occurred.",
          ephemeral: true
        });
      } else {
        await interaction.reply({
          content: "❌ An unexpected error occurred.",
          ephemeral: true
        });
      }
    }
  }
};
