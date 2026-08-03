const Guild = require("../models/Guild");

const spamMap = new Map();

const badWords = [
    "fuck",
    "bitch",
    "asshole",
    "motherfucker",
    "nigga",
    "porn"
];

module.exports = {
    name: "messageCreate",

    async execute(message) {

        if (!message.guild) return;
        if (message.author.bot) return;

        const data = await Guild.findOne({
            guildId: message.guild.id
        });

        if (!data) return;

        // Ignore admins
        if (message.member.permissions.has("Administrator")) return;

        /* ================= Anti Link ================= */

        if (data.antiLink) {

            const linkRegex = /(https?:\/\/|www\.)/gi;

            if (linkRegex.test(message.content)) {

                await message.delete().catch(() => {});

                return message.channel.send({
                    content: `🚫 ${message.author}, links are not allowed here.`
                }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
            }

        }

        /* ================= Anti Invite ================= */

        if (data.antiInvite) {

            const inviteRegex = /(discord\.gg|discord\.com\/invite)/gi;

            if (inviteRegex.test(message.content)) {

                await message.delete().catch(() => {});

                return message.channel.send({
                    content: `🚫 ${message.author}, Discord invites are not allowed.`
                }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
            }

        }

        /* ================= Anti Bad Words ================= */

        if (data.antiBadWords) {

            const msg = message.content.toLowerCase();

            if (badWords.some(word => msg.includes(word))) {

                await message.delete().catch(() => {});

                return message.channel.send({
                    content: `🤬 ${message.author}, watch your language.`
                }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
            }

        }

        /* ================= Anti Mention Spam ================= */

        if (data.antiMention) {

            if (message.mentions.users.size >= 5) {

                await message.delete().catch(() => {});

                return message.channel.send({
                    content: `🚫 ${message.author}, too many mentions.`
                }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));
            }

        }

        /* ================= Anti Spam ================= */

        if (data.antiSpam) {

            const now = Date.now();

            if (!spamMap.has(message.author.id)) {
                spamMap.set(message.author.id, []);
            }

            const userMessages = spamMap.get(message.author.id);

            userMessages.push(now);

            const recent = userMessages.filter(time => now - time < 5000);

            spamMap.set(message.author.id, recent);

            if (recent.length >= 6) {

                await message.delete().catch(() => {});

                return message.channel.send({
                    content: `⚠️ ${message.author}, stop spamming.`
                }).then(m => setTimeout(() => m.delete().catch(() => {}), 5000));

            }

        }

    }
};
