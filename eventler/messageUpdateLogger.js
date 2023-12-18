
/** 
const Discord = require('discord.js')
const moment = require('moment')
module.exports = {
    name : Discord.Events.MessageUpdate,
    on: true,
    async execute(message1, message2, client) {

        let embed = new Discord.EmbedBuilder()
        embed.setColor('Orange')
        embed.setTitle('Bir kullanıcı mesajını düzenledi.')

        embed.setFooter({text: `${moment().format('hh:mm:ss DD/MM/YYYY')}`, iconURL: `${message1.author.avatarURL()}`})
        embed.setThumbnail(message1.author.avatarURL())

        embed.addFields(
          
          { name: "Kullanıcı", value:`${message1.author.username}` , inline:true},
          { name: "Kanal", value: `<#${message1.channel.id}>`, inline:true},
          {name : "İlk Mesaj", value: `${message1}`},

          {name : "Son Mesaj", value: `${message2}`}
        )


        message1.guild.channels.cache.get('1157792286214737920').send({embeds: [embed]})
    }
}

*/