const fs = require("fs");
const path = require("path");

module.exports = (client) => {
    const commandsPath = path.join(__dirname, "..", "commands");

    if (!fs.existsSync(commandsPath)) {
        console.log("⚠️ Commands folder not found.");
        return;
    }

    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);

        if (!fs.statSync(folderPath).isDirectory()) continue;

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {
            const command = require(path.join(folderPath, file));

            if (!command.name) continue;

            client.commands.set(command.name, command);

            if (command.aliases && Array.isArray(command.aliases)) {
                for (const alias of command.aliases) {
                    client.aliases.set(alias, command.name);
                }
            }

            console.log(`✅ Loaded Command: ${command.name}`);
        }
    }

    console.log(`📦 Total Commands: ${client.commands.size}`);
};
