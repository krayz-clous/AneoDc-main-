const { MessageEmbed, MessageCollector, Permissions } = require('discord.js');
const TicketData =  require("../../models/TicketData")
const config = require("../../config.json")
module.exports = {
    name: 'ticket-setup',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        try {
        let ticketData = await TicketData.findOne({ GuildID: message.guild.id });
        if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
            return message.channel.send({content: 'You are missing permissions! You must have the **MANAGE_SERVER** permission.'});
        }
        
        if (!ticketData) {
            const firstEmbed = new MessageEmbed()
                .setTitle('Ticket System Setup | Part 1 of 4')
                .setDescription('What do you want the embed description to be?')
                .setColor('BLUE');
            let firstMsg = await message.channel.send({embeds: [firstEmbed]});
    
            const firstFilter = m => m.author.id === message.author.id;
            const firstCollector = new MessageCollector(message.channel, firstFilter, { max: 2 });
    
            var embedDescription;
    
            firstCollector.on('collect', async msg => {
                embedDescription = msg.content;
                const secondEmbed = new MessageEmbed()
                    .setTitle('Ticket System Setup | Part 2 of 4')
                    .setDescription('Where do you want to send this message so a user can create a ticket? Please mention a channel.')
                    .setColor('BLUE');
                msg.channel.send({embeds: [secondEmbed]});
                firstCollector.stop();
    
                const secondFilter = m => m.author.id === message.author.id;
                const secondCollector = new MessageCollector(message.channel, secondFilter, { max: 4 });
    
                secondCollector.on('collect', async msg => {
                    let embedChannel = msg.mentions.channels.first();
                    if (!embedChannel) {
                        msg.channel.send({content: 'That is not a correct channel! Please try again.'});
                        secondCollector.stop();
                        return;
                    }
    
                    const thirdEmbed = new MessageEmbed()
                        .setTitle('Ticket System Setup | Part 3 of 4')
                        .setDescription('What roles can see thie ticket? Please provide a role name, mention, or ID.')
                        .setColor('BLUE');
                    msg.channel.send({embeds: [thirdEmbed]});
                    secondCollector.stop();
    
                    const thirdFilter = m => m.author.id === message.author.id;
                    const thirdCollector = new MessageCollector(message.channel, thirdFilter, { max: 2 });
    
                    thirdCollector.on('collect', async message => {
                        let savedRole = message.mentions.roles.first() || message.guild.roles.cache.get(message.content) || message.guild.roles.cache.find(role => role.name.toLowerCase() === message.content.toLowerCase());
    
                        if (!savedRole) {
                            msg.channel.send({content: 'That is not a valid role! Please try again.'});
                            thirdCollector.stop();
                            return;
                        }
    
                        const fourthEmbed = new MessageEmbed()
                            .setTitle('Ticket System Setup | Part 4 of 4')
                            .setDescription('The setup is now finished!')
                            .setColor('BLUE');
                        await msg.channel.send({embeds: [fourthEmbed]});
                        thirdCollector.stop();
    
                        await createTicketSystem(ticketData, embedDescription, embedChannel, message, savedRole)
                    });
                });
            });
        } else {
            await TicketData.findOneAndRemove({
                GuildID: message.guild.id
            });
            message.channel.send({content: `**Successfuly Reset the Ticket System on your Server!**\nuse the command to again to set it up!`});
        }    
    } catch (e) {
        message.channel.send({content: `An error has occured, please try again.`})
        console.log(e);
    }
    }
}

async function createTicketSystem(ticketData, embedDescription, embedChannel, message, savedRole) {
    const sendEmbed = new MessageEmbed()
        .setTitle('Ticket')
        .setDescription(embedDescription)
        .setColor('RANDOM');

    let msg = await embedChannel.send({embeds: [sendEmbed]});
    await msg.react('🎟');

    const newData = new TicketData({
        GuildID: message.guild.id,
        MessageID: msg.id,
        TicketNumber: 0,
        WhitelistedRole: savedRole.id
    });
    newData.save();
}
