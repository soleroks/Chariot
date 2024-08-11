const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json')
let uyeSema = require('../mongo/PoAUser.js')
let envanterSema = require('../mongo/PoAEnvanter.js')
const envanter = require('./envanter')
const moment = require('moment')
moment.locale('tr')
module.exports = {
   data: new Discord.SlashCommandBuilder()
   .setName('envantertest')
   .setDescription('[SAHİP] Envanter Test Aracı')
  
   .addStringOption(option => 
      option.setName('ad').setDescription('Eklenecek eşyanın adı?').setRequired(true)
      
      )
   .addUserOption(option => option.setName('üye').setDescription('Eşya eklenecek üyeyi belirtin.').setRequired(true))
   .addBooleanOption(option => option.setName('uygunluk').setDescription('Satış veya takas için uygun mu?').setRequired(true))
   .addNumberOption(option=>option.setName("minfiyat").setDescription('Eşyanın minimum fiyatı ne olacak?').setRequired(true))
   .addNumberOption(option=>option.setName("maxfiyat").setDescription('Eşyanın maksimum fiyatı ne olacak?').setRequired(true))
   .addStringOption(option=>option.setName('pazar').setDescription('Eşya sadece hangi pazarda satılabilecek?').setRequired(true)
   
   .addChoices(
    {name: "Oyuncu Pazarı", value: "Oyuncu"},
    {name: "Sunucu Pazarı", value: "Sunucu"}
   )
   )

  ,
   async execute(interaction) {
      let uyeMmmember = interaction.options.getUser('üye')
    

      let uye = ""
       if(uyeMmmember) uye = interaction.guild.members.cache.get(uyeMmmember.id) || interaction.member
  
       else if(!uyeMmmember) uye = interaction.member
       
  
       /**
        *     userInventory: [{
        itemName: String,
        itemID: String,
        itemCreatedDate: String,
        itemAddedBy: String,
        Trade: {
            isTradeable: Boolean,
            tradeMinPrice: Number,
            tradeMaxPrice: Number,
            tradeMarket: {
                type: String,
                default: "Sunucu",  

            }
        }
    }]
        * 
        */
       let veri = interaction.options.getString('ad')
       let veriEligible = interaction.options.getBoolean('uygunluk')
       let veriMinFiyat = interaction.options.getNumber('minfiyat')
       let veriMaxFiyat = interaction.options.getNumber('maxfiyat')
       let veriPazar = interaction.options.getString('pazar')




       let bilgi = await envanterSema.findOne({userID: uye.id})

       if(!bilgi) return
       if(bilgi.userInventory.length === bilgi.InventoryMax) return interaction.reply('Üyenin envanter slot dolmuştur.')
     
       interaction.client.itemEkle(uye.id, interaction.user.id, veri, veriEligible, veriMinFiyat, veriMaxFiyat, veriPazar)
      // (kisi, kisi2 ,itemİsmi, tradeEligible, minPrice, maxPrice, Market)

       interaction.reply(`${veri} eşyası başarıyla eklendi.`)
    
}

// NASIL ÇALIŞIYOR HİÇBİR BİLGİM YOK -s 
// KENDİM YAPTIM -s
}