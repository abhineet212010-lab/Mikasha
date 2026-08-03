const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const fs = require('fs');
const path = require('path');

(async () => {
  if (!process.env.TOKEN || !process.env.CLIENT_ID || !process.env.GUILD_ID) {
    console.error('TOKEN, CLIENT_ID and GUILD_ID must be set in env.');
    process.exit(1);
  }

  const commands = [];
  const commandsPath = path.join(__dirname, 'commands');

  function walkDir(dir) {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) walkDir(full);
      else if (full.endsWith('.js')) {
        try {
          const cmd = require(full);
          if (cmd.data && typeof cmd.data.toJSON === 'function') {
            commands.push(cmd.data.toJSON());
          }
        } catch (err) {
          console.warn('Skipping command file:', full, err.message);
        }
      }
    }
  }

  if (fs.existsSync(commandsPath)) walkDir(commandsPath);

  const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

  try {
    console.log(`Registering ${commands.length} commands to guild ${process.env.GUILD_ID}`);
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('Commands registered.');
  } catch (err) {
    console.error('Failed to register commands:', err);
  }
})();
