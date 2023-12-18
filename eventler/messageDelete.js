/** 
const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
    name : Discord.Events.MessageDelete,
    on:true,
    async execute(message) {
        if(message.attachments.size > 0) return
        const DataAl = await message.guild.fetchAuditLogs({
            type: Discord.AuditLogEvent.MessageDelete,
            limit: 1,
        });
        
        const IlkData = DataAl.entries.first();

      
        if(IlkData.target.id !== message.author.id) return
        else if(IlkData.target.id === message.author.id) {

            message.guild.channels.cache.get('1157792327230828685').send({embeds: [new Discord.EmbedBuilder()
                .addFields(
                    {name : "Silen", value: `<@${IlkData.executor.id}>`, inline:true},
                    {name: "Silinen", value: `<@${message.author.id}>`, inline:true},
                    {name: "Silinen mesaj içeriği", value: `${message.content}`}   
                )
  
                .setTitle('Bir kullanıcının mesajı silindi.')
                .setColor('Red')
                .setFooter({text: `${moment().format('hh:mm:ss DD/MM/YYYY')}`})
            ]})
        }
    
    
    }

}
*/