const {
    EmbedBuilder
} = require("discord.js");

const Guild = require("../models/Guild");

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        try {

            const data = await Guild.findOne({
                guildId: member.guild.id
            });

            if (!data || !data.welcomeChannel) return;

            const channel = member.guild.channels.cache.get(
                data.welcomeChannel
            );

            if (!channel) return;


            const embed = new EmbedBuilder()
                .setColor("#ff4d6d")
                .setTitle("👋 Welcome To The Server!")
                .setDescription(
`Hey ${member} 👋

Welcome to **${member.guild.name}** 🎉

You are our **${member.guild.memberCount}th member**!

Enjoy your stay and have fun 💖`
                )
                .setThumbnail(
                    member.user.displayAvatarURL({
                        dynamic: true
                    })
                )
                .setFooter({
                    text: "Mikasa Welcome System"
                })
                .setTimestamp();


            await channel.send({
                embeds: [embed]
            });


        } catch (error) {
            console.error(
                "Welcome Error:",
                error
            );
        }
    }
};        const role = member.guild.roles.cache.get(roleId);
        if (role) {
          try {
            await member.roles.add(role);
          } catch (error) {
            console.error('Failed to assign role:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error handling guildMemberAdd:', error);
    }
  },
};
