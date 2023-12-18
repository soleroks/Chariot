const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
let uyeSema = require('../şemalar/PoAUser.js')
let envanterSema = require('../şemalar/PoAEnvanter.js')
module.exports = {
   data: new Discord.SlashCommandBuilder()
   .setName('envanter')
   .setDescription('Envanterinizi görmenizi sağlar.')
   .addUserOption(option => 
    option.setName('üye')
    .setDescription('Envanteri gösterilecek üyeyi belirtin.')
    .setRequired(false)),
   async execute(interaction) {


    let uyeMmmember = interaction.options.getUser('üye')
    

    let uye = ""
     if(uyeMmmember) uye = interaction.guild.members.cache.get(uyeMmmember.id) || interaction.member

     else if(!uyeMmmember) uye = interaction.member
     


    let bilgi = await envanterSema.findOne({userID: uye.id})
    if(!bilgi)  {
         
        
        let yeni = await new envanterSema({
            userID: uye.id
        })

        await yeni.save()
    }


    let EnvanterSirala = bilgi.userInventory

    
let desc = ""
let toplamSlot = bilgi.InventoryMax

let kalan = toplamSlot - EnvanterSirala.length
    for (let i = 0; i < EnvanterSirala.length; i++) {
        desc += `${i+1} - ${EnvanterSirala[i].itemName}\n`

        
    }
    
    interaction.reply(desc == "" ? "Envanter henüz oluşturulmadı." :  desc)
   }
   
    

}