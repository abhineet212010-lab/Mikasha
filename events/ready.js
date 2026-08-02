const {
    ActivityType
} = require("discord.js");

module.exports = {
    name: "ready",
    once: true,

    async execute(client) {

        console.log(`
╔══════════════════════╗
   🎀 Mikasa Online
╠══════════════════════╣
   Bot: ${client.user.tag}
   Servers: ${client.guilds.cache.size}
   Users: ${client.users.cache.size}
╚══════════════════════╝
        `);


        client.user.setPresence({
            status: "online",

            activities: [
                {
                    name: `${client.guilds.cache.size} Servers | /help`,
                    type: ActivityType.Watching
                }
            ]
        });


        console.log("✅ Status Loaded");
        console.log("✅ All Systems Ready");

    }
};
