const Discord = require('discord.js')
const moment = require('moment')
moment.locale('tr')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('itembak')
    .setDescription('[YETKİLİ] Belirtilen bir eşyanın bilgilerini gösterir.')
    .addStringOption(option=>option.setName('solid').setDescription('Detayları gösterilecek eşyanın SOL kodunu belirtin.').setRequired(true)),
    async execute(interaction) {
        let veri = interaction.options.getString('solid')

        
     let bilgi= "yok"
     console.log(bilgi)

     interaction.reply({embeds: [new Discord.EmbedBuilder()
    
        .addFields(
            {name: "Eşyanın Adı", value: bilgi.itemName, inline:true},
            {name: "Eşyanın Eklendiği Tarih" ,value: bilgi.itemCreatedDate, inline:true },
            {name: "Eşyayı Ekleyen Kişi", value: bilgi.itemAddedBy, inline:true},
                  {name: "Eşya Takas İçin Müsait Mi?", value: `${bilgi.Trade.isTradeable}`, inline:true}, 
            {name: "Eşyanın Min Fiyatı", value: `${bilgi.Trade.tradeMinPrice}`, inline:true},
            {name: "Eşyanın Max Fiyatı", value: `${bilgi.Trade.tradeMaxPrice}`, inline:true},
            {name: "Eşyanın Satışa Uygun Olduğu Pazar", value: `${bilgi.Trade.tradeMarket}`, inline:true}, 
      


        )
    
    ]})
    }
}