const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,

  async execute(client) {
    console.clear();

    console.log("======================================");
    console.log("🤖 Mikasa Discord Bot");
    console.log("======================================");
    console.log(`✅ Logged in as: ${client.user.tag}`);
    console.log(`🆔 Bot ID: ${client.user.id}`);
    console.log(`🌍 Servers: ${client.guilds.cache.size}`);
    console.log(`👥 Users: ${client.users.cache.size}`);
    console.log("======================================");

    const statuses = [
      { name: "/help", type: ActivityType.Playing },
      { name: `${client.guilds.cache.size} Servers`, type: ActivityType.Watching },
      { name: "Made by Abhineet Nayak", type: ActivityType.Playing },
      { name: "discord.js v14", type: ActivityType.Listening }
    ];

    let i = 0;

    setInterval(() => {
      if (i >= statuses.length) i = 0;

      client.user.setActivity(statuses[i].name, {
        type: statuses[i].type
      });

      i++;
    }, 15000);

    console.log("🚀 Mikasa is Online!");
  }
};
