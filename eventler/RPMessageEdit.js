const UyeSema = require('../mongo/PoAUser.js')
const Discord = require('discord.js')
const moment = require('moment')
moment.locale('tr')
const ayarlar = require('../config/ayarlar.json')

module.exports = {

    name: Discord.Events.MessageUpdate,
    on:true,
    async execute(oldMessage, newMessage) {

        if(!oldMessage.content) return
        if(oldMessage.content === newMessage.content) return
        if(!ayarlar.rpKat.includes(oldMessage.channel.parent.id)) return
        let eskiRPPuan = oldMessage.content.replace(/ /g, "")
        let eskiRPPuanFinal = eskiRPPuan.length / 4
        let yeniRPPuan = newMessage.content.replace(/ /g, "")
        let yeniRPPuanFinal = yeniRPPuan.length / 4
      
      
        // EĞER ESKİ RP PUANI YÜKSEK İSE
        if(eskiRPPuanFinal > yeniRPPuanFinal) {

            let EskicikartilacakPuan = eskiRPPuanFinal-yeniRPPuanFinal
            console.log(EskicikartilacakPuan) 
        await UyeSema.findOneAndUpdate({"kullanici.userID": oldMessage.author.id}, {$inc: {"kullaniciRP.RPPuan.genelPuan" : -EskicikartilacakPuan}})
        await UyeSema.findOneAndUpdate({"kullanici.userID": oldMessage.author.id}, {$inc: {"kullaniciRP.RPPuan.haftalikPuan" : -EskicikartilacakPuan}})
        }

     

            let Yenieklenecekpuan = yeniRPPuanFinal-eskiRPPuanFinal
            console.log(Yenieklenecekpuan)
            await UyeSema.findOneAndUpdate({"kullanici.userID": oldMessage.author.id}, {$inc: {"kullaniciRP.RPPuan.genelPuan" : +Yenieklenecekpuan}})
            await UyeSema.findOneAndUpdate({"kullanici.userID": oldMessage.author.id}, {$inc: {"kullaniciRP.RPPuan.haftalikPuan" : +Yenieklenecekpuan}})

        
    

    }



}