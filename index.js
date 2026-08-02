require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  ActivityType
} = require("discord.js");

const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction,
    Partials.User
  ]
});

client.commands = new Collection();
client.slashCommands = new Collection();
client.aliases = new Collection();

global.client = client;

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("🟢 MongoDB Connected");
  } catch (err) {
    console.error("🔴 MongoDB Error:", err);
  }
}

function loadEvents() {
  const eventsPath = path.join(__dirname, "events");

  if (!fs.existsSync(eventsPath)) return;

  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`✅ Loaded ${eventFiles.length} Events`);
}

client.once("ready", () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);

  client.user.setActivity("Mikasa | /help", {
    type: ActivityType.Playing
  });
});

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

(async () => {
  await connectMongo();

  loadEvents();

  client.login(process.env.TOKEN);
})();
