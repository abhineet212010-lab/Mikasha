const User = require("../models/User");

module.exports = {
    name: "messageCreate",

    async execute(message, client) {

        if (message.author.bot) return;
        if (!message.guild) return;


        /* ==========================
           XP SYSTEM
        ========================== */

        try {

            let userData = await User.findOne({
                userId: message.author.id,
                guildId: message.guild.id
            });


            if (!userData) {

                userData = await User.create({
                    userId: message.author.id,
                    guildId: message.guild.id
                });

            }


            const xpGain = Math.floor(
                Math.random() * 15
            ) + 5;


            userData.xp += xpGain;


            const neededXP =
                userData.level * 100;


            if (userData.xp >= neededXP) {

                userData.level += 1;
                userData.xp = 0;


                message.channel.send({
                    content:
`🎉 Congratulations ${message.author}!

You reached **Level ${userData.level}** 🚀`
                });

            }


            await userData.save();


        } catch (err) {

            console.error(
                "XP Error:",
                err
            );

        }



        /* ==========================
           PREFIX COMMAND SYSTEM
        ========================== */

        const prefix =
            process.env.PREFIX || "!";


        if (!message.content.startsWith(prefix))
            return;


        const args =
            message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/);


        const commandName =
            args.shift()
            .toLowerCase();


        const command =
            client.commands.get(commandName) ||
            client.commands.get(
                client.aliases.get(commandName)
            );


        if (!command) return;


        try {

            await command.execute(
                message,
                args,
                client
            );


        } catch (error) {

            console.error(error);


            message.reply({
                content:
                "❌ Command execute karte time error aaya."
            });

        }

    }
};
