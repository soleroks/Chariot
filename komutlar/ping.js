const Discord = require('discord.js')
const ayarlar = require('../config/ayarlar.json')
module.exports = {
   data: new Discord.SlashCommandBuilder()
   .setName('ping')
   .setDescription('[SAHİP] Botun gecikmesini ölçer.'),
   async execute(interaction) {

    if(!ayarlar.sahip.includes(interaction.user.id)) return interaction.reply({ephemeral: true, content: "Bu komutu kullanamazsınız."})

    interaction.reply(`**Pong!** ${interaction.client.ws.ping}ms`)
   }
   
    
}