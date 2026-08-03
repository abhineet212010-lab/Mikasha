const useMongoose = Boolean(process.env.MONGODB_URI);

if (useMongoose) {
  const mongoose = require("mongoose");

  const userSchema = new mongoose.Schema({
    guildId: { type: String, required: true },
    userId: { type: String, required: true },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 0 }
  }, { timestamps: true });

  userSchema.index({ guildId: 1, userId: 1 }, { unique: true });

  module.exports = mongoose.model("User", userSchema);
} else {
  // In-memory fallback for users
  const store = new Map(); // key: `${guildId}:${userId}`

  function key(guildId, userId) { return `${guildId}:${userId}`; }

  class UserDoc {
    constructor(obj) { Object.assign(this, obj); }
    async save() { store.set(key(this.guildId, this.userId), this); return this; }
  }

  module.exports = {
    async find(query) {
      const results = [];
      const prefix = `${query.guildId}:`;
      for (const [k, v] of store.entries()) {
        if (k.startsWith(prefix)) results.push(new UserDoc(v));
      }
      return results;
    },
    async findOne(query) {
      const v = store.get(key(query.guildId, query.userId));
      return v ? new UserDoc(v) : null;
    },
    async create(obj) {
      const data = Object.assign({ xp: 0, level: 0 }, obj);
      const doc = new UserDoc(data);
      store.set(key(doc.guildId, doc.userId), doc);
      return doc;
    },
    _internal_store: store
  };
}
