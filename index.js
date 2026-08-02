require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection
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
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.Reaction
  ]
});

client.commands = new Collection();
client.aliases = new Collection();

async function connectMongo() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error:", err);
  }
}

function loadHandlers() {
  const handlersPath = path.join(__dirname, "handlers");

  if (!fs.existsSync(handlersPath)) return;

  const handlerFiles = fs
    .readdirSync(handlersPath)
    .filter(file => file.endsWith(".js"));

  for (const file of handlerFiles) {
    require(`./handlers/${file}`)(client);
  }
}

function loadEvents() {
  const eventsPath = path.join(__dirname, "events");

  if (!fs.existsSync(eventsPath)) return;

  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    const event = require(`./events/${file}`);

    if (event.once) {
      client.once(event.name, (...args) =>
        event.execute(...args, client)
      );
    } else {
      client.on(event.name, (...args) =>
        event.execute(...args, client)
      );
    }
  }
}

(async () => {
  await connectMongo();

  loadHandlers();

  loadEvents();

  client.login(process.env.TOKEN);
})();

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);
