const Levels = require("discord-xp");
/* eslint-disable*/
const { MessageEmbed, Permissions } = require("discord.js");
const schema = require("../../models/level");

module.exports = {
  name: "reset-xp",
  aliases: ["rsxp", "rxp", "resxp"],
  timeout: "3000",
  description: "Reset all XP of a member",
  requirePermission: "Manage Server",
  usage: "[@Member]",
  run: async (client, message, args) => {
    const data = await schema.findOne({ Guild: message.guild.id });
    if (!data) return message.channel.send({content: `Leveling System is not enabled`});
    if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      return message.channel.send({content:
        `You don't have permission to use this command`
      }
      );
    const member =
      (await message.mentions.members.first()) ||
      message.guild.members.cache.get(args[0]);
    if (!member) return message.channel.send({content: `You specified incorrect usage`});
    await Levels.setXp(member.id, message.guild.id, 0);
    message.channel.send({
      content: `Reseted all **XPs (Levels)** of **${member.user.tag}**`,
    });
  },
};
