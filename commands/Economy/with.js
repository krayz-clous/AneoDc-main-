const Discord = require("discord.js");
const ms = require("parse-ms");
require("../../ExtendedMessage")
const db = require("quick.db")
module.exports = {
  name: 'with',
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run:async (client , message , args) => {
 

  let user = message.author;

  let member = db.fetch(`money_${user.id}`)
  let member2 = db.fetch(`bank_${user.id}`)

  if (args[0] == 'all' || args[0] == "max") {
    let money = await db.fetch(`bank_${user.id}`)
    
    db.subtract(`bank_${user.id}`, money)
    db.add(`money_${user.id}`, money)
  
  message.inlineReply(`You have withdrawn all your Coins from your bank`, { allowedMentions: { repliedUser: false } })
  
  } else {


  
  if (!args[0]) {
      return message.inlineReply(`Please specify an amount to withdraw!`, { allowedMentions: { repliedUser: false } })
  }
  

  if (message.content.includes('-')) { 
      return message.inlineReply(`You can't withdraw negative money!`, { allowedMentions: { repliedUser: false } })
  }
  

  if (member2 < args[0]) {
      return message.inlineReply(`You don't have that much money!`, { allowedMentions: { repliedUser: false } })
  }

message.inlineReply(`Successfully withdrawn ${args[0]} Coins from your bank!`, { allowedMentions: { repliedUser: false } })
  db.subtract(`bank_${user.id}`, args[0])
  db.add(`money_${user.id}`, args[0])
  }
}
}