const useMongoose = Boolean(process.env.MONGODB_URI);

if (useMongoose) {
  const mongoose = require("mongoose");

  const guildSchema = new mongoose.Schema({
    guildId: { type: String, required: true, unique: true },
    welcomeChannel: { type: String, default: null },
    goodbyeChannel: { type: String, default: null },
    logChannel: { type: String, default: null },
    ticketCategory: { type: String, default: null },
    ticketLogs: { type: String, default: null },
    supportRole: { type: String, default: null },

    // AutoMod
    antiLink: { type: Boolean, default: false },
    antiInvite: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false },
    antiBadWords: { type: Boolean, default: false },
    antiMention: { type: Boolean, default: false },
    antiGhostPing: { type: Boolean, default: false },
    antiRaid: { type: Boolean, default: false },

    prefix: { type: String, default: "!" }
  }, { timestamps: true });

  module.exports = mongoose.model("Guild", guildSchema);
} else {
  // In-memory fallback (simple, persists only while process runs)
  const store = new Map();

  function defaults(guildId) {
    return {
      guildId,
      welcomeChannel: null,
      goodbyeChannel: null,
      logChannel: null,
      ticketCategory: null,
      ticketLogs: null,
      supportRole: null,
      antiLink: false,
      antiInvite: false,
      antiSpam: false,
      antiBadWords: false,
      antiMention: false,
      antiGhostPing: false,
      antiRaid: false,
      prefix: "!"
    };
  }

  class GuildDoc {
    constructor(obj) { Object.assign(this, obj); }
    async save() { store.set(this.guildId, this); return this; }
  }

  module.exports = {
    async findOne(query) {
      const g = store.get(query.guildId);
      return g ? new GuildDoc(g) : null;
    },
    async create(obj) {
      const data = Object.assign(defaults(obj.guildId), obj);
      const doc = new GuildDoc(data);
      store.set(doc.guildId, doc);
      return doc;
    },
    // Expose for tests/inspection if needed
    _internal_store: store
  };
}
