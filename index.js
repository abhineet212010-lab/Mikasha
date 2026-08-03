require("dotenv").config();

const {
    Client,
    GatewayIntentBits,
    Partials,
    Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");
const logger = require("./utils/logger");
        const User = require("./models/User");       

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildModeration,
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
client.aliases = new Collection();

global.client = client;

/* ==============================
   Load Handlers
============================== */

function loadHandlers() {

    const handlersPath = path.join(__dirname, "handlers");

    if (!fs.existsSync(handlersPath)) return;

    const files = fs
        .readdirSync(handlersPath)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {
        require(`./handlers/${file}`)(client);
    }

    logger.success("Handlers Loaded");
}

/* ==============================
   Load Events
============================== */

function loadEvents() {

    const eventsPath = path.join(__dirname, "events");

    if (!fs.existsSync(eventsPath)) return;

    const files = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of files) {

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

    logger.success("Events Loaded");
}

/* ==============================
   Error Handlers
============================== */

process.on("unhandledRejection", console.error);
process.on("uncaughtException", console.error);

/* ==============================
   Start Bot
============================== */

(async () => {

    // Note: MongoDB usage was removed per your request. Models now use an in-memory
    // fallback when MONGODB_URI is not set. See models/* for details.

    loadHandlers();

    loadEvents();

    client.login(process.env.TOKEN).catch(err => {
        logger.error('Failed to login:', err && err.message ? err.message : err);
        process.exit(1);
    });

})();
