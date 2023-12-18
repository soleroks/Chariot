
const Discord = require('discord.js')
const uyeSema = require('../şemalar/PoAUser')
const ayarlar = require('../ayarlar.json')
const moment = require('moment')
moment.locale('tr')
module.exports = {
    name : Discord.Events.MessageCreate,
    on: true,
    async execute(message) {
        if(message.content.startsWith('//')) {
          setInterval(() => {
            message.delete()    
          }, 5000);
        }

  
        if(message.author.bot) return
        
        if(!ayarlar.rpKategoriler.includes(message.channel.parent.id)) return
let string = message.content.replace(/ /g, "")
let RPPuanFinal = string.length / 4

await uyeSema.findOneAndUpdate({"kullanici.userID" : message.author.id}, { $inc: {"kullaniciRP.RPPuan.genelPuan": +RPPuanFinal}})
await uyeSema.findOneAndUpdate({"kullanici.userID" : message.author.id}, { $inc: {"kullaniciRP.RPPuan.haftalikPuan": +RPPuanFinal}})
await uyeSema.findOneAndUpdate({"kullanici.userID": message.author.id}, {$set: {"kullaniciRP.RPBilgi.sonTarih": moment().unix()}})
await uyeSema.findOneAndUpdate({"kullanici.userID": message.author.id}, {$set: {"kullaniciRP.RPBilgi.sonKanalURL" : message.url}})
await uyeSema.findOneAndUpdate({"kullanici.userID": message.author.id}, {$set: {"kullaniciRP.RPBilgi.sonKanal" : message.channel.id}})


      }
    }