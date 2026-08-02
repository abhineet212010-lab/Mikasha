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
};

      // Add welcome text
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 15;
      ctx.font = 'bold 150px Arial'; // Use system font
      ctx.fillStyle = '#FFD700';
      ctx.textAlign = 'center';
      ctx.fillText('Welcome', canvas.width / 2, 750);

      ctx.font = '100px Arial';
      ctx.fillStyle = '#FFFFFF';
      ctx.fillText(`${member.user.username}`, canvas.width / 2, 850);

      ctx.font = '80px Arial';
      ctx.fillStyle = '#FFD700';
      ctx.fillText(
        `You are our ${memberCount}${ordinalSuffix} Member!`,
        canvas.width / 2,
        950
      );

      // Send welcome image
      const attachment = new AttachmentBuilder(canvas.toBuffer('image/png'), {
        name: 'welcome.png',
      });
      const welcomeChannel = member.guild.channels.cache.get(
        welcomeData.channelId
      );
      if (welcomeChannel) {
        const welcomeEmbed = new EmbedBuilder()
          .setColor('#00BFFF')
          .setDescription(description)
          .setImage('attachment://welcome.png')
          .setTimestamp();

        welcomeChannel.send({ embeds: [welcomeEmbed], files: [attachment] });
      }

      // Assign auto roles
      if (!autoRole || autoRole.roleIds.length === 0) return;
      for (const roleId of autoRole.roleIds) {
        const role = member.guild.roles.cache.get(roleId);
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
