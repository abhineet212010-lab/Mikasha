require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");

const commands = [];

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
    const files = fs.readdirSync(path.join("./commands", folder))
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        const command = require(`./commands/${folder}/${file}`);

        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🚀 Deploying Slash Commands...");

        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        console.log(`✅ ${commands.length} Slash Commands Deployed`);
    } catch (err) {
        console.error(err);
    }
})();
