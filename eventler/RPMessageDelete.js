const Discord = require('discord.js')
const uyeSema = require('../şemalar/PoAUser.js')

const ayarlar = require('../ayarlar.json')
module.exports = {
    name : Discord.Events.MessageDelete,
    on:true,
    async execute(message) {
        if(!message.content) return
        if(message.author.bot) return

        if(!ayarlar.rpKategoriler.includes(message.channel.parent.id)) return
        
        let Silinecek = message.content.replace(/ /g, "")
        let SilinecekPuan = Silinecek.length / 4

       await uyeSema.findOneAndUpdate({"kullanici.userID": message.author.id},
       
       {
        $inc: {
            "kullaniciRP.RPPuan.genelPuan": -SilinecekPuan
        }
       })

       await uyeSema.findOneAndUpdate({"kullanici.userID": message.author.id},
       
       {
        $inc: {
            "kullaniciRP.RPPuan.haftalikPuan": -SilinecekPuan
        }
       })



    }
}