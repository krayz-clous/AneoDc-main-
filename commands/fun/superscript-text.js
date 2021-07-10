/* eslint-disable no-unused-vars */
const { Client, Message, MessageEmbed } = require("discord.js");
const supr = require("superscript-text");
module.exports = {
  name: "superscript-text",
  aliases: ["stext"],
  description: "Superscript your text",
  usage: "<text>",
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const text = args.join(" ");
    if (!text) return message.reply({content: `Please provide some text`});
    if (text.includes("@")) return message.reply({content: `:x:`});
    message.channel.send({content: supr(text)});
  },
};
