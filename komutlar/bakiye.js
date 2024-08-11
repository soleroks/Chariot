const Discord = require('discord.js')
const moment = require('moment')
const uyeSema = require('../mongo/PoAUser.js')
moment.locale('tr')

module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('bakiye')
    .setDescription('Kullanan veya belirtilen üyenin bakiye ve son işlem bilgilerini görüntüler.')
    .addSubcommand(subcommand =>
         subcommand.setName('havale')
         .setDescription('Belirtilen bir üyeye bakiye göndermenizi sağlar.')
         .addUserOption(option=>
             option.setName('üye')
             .setDescription('Bakiye gönderilecek üyeyi belirtin.')
             .setRequired(true))
         .addIntegerOption(option2 => 
            option2.setName('miktar')
            .setMinValue(50)
            .setDescription('Gönderilecek bakiye miktarını belirtin.')
            .setRequired(true)))
    .addSubcommand(subcommand => 
        subcommand.setName('bilgi')
        .setDescription('Belirtilen bir üyenin veya kendinizin bakiyesini görüntülemenizi sağlar.')
        .addUserOption(option=> 
           option.setName('üye')
            .setDescription('Bakiyesi gösterilecek üyeyi belirtin. (Kimse belirtilmez ise kendi bakiyeniz gösterilir.)')
            .setRequired(false))),

    async execute(interaction) {
     


        if(interaction.options.getSubcommand() === "havale") {

            let uyeMmmember = interaction.options.getUser('üye')
    

            let gidecekMiktar = interaction.options.getInteger('miktar')


        
            let uye = interaction.guild.members.cache.get(uyeMmmember.id)
 
           
         
             if(uye.id === interaction.user.id) return interaction.reply({ephemeral: true, content: "Kendinize bakiye gönderemezsiniz. (Yapabilseniz bile bu çok saçma olurdu.)"})
             if(uye.bot) return interaction.reply({ephemeral:true, content: "Botlara bakiye gönderemezsin."})
             let kontrol = await uyeSema.findOne({"kullanici.userID": interaction.user.id})
       
            if(kontrol.kullaniciJC.Bakiye <  -2000) return interaction.reply({ephemeral:true, content: `Hesabınız -2000 bakiye altına düştüğü için işlem yapmaya kapatılmıştır.`})

            let next = kontrol.kullaniciJC.Bakiye-gidecekMiktar
            if(next < -1999) return interaction.reply('Bu işlem sonunda hesabınız kilitleneceği için transfer iptal edildi.')
             
             let bilgi = await uyeSema.findOne({"kullanici.userID" : uye.id})
             if(!bilgi) return interaction.reply({content: "Belirttiğiniz kişiye ait hiçbir veri yok! Bu, ciddi bir hatadır. Geliştirici ile iletişime geçin. Hata Kodu: DB_80"})
        
             if(bilgi.kullaniciJC.Bakiye < -2000) return interaction.reply('Bakiye göndermek istediğiniz kişinin bakiye hesabı kilitli olduğu için işlem tamamlanamadı.')
             interaction.client.bakiyeTransfer(interaction.user.id, uye.id, gidecekMiktar)
     
             interaction.reply({embeds: [
                new Discord.EmbedBuilder()
                .setColor('Green')
                .setDescription(`${uye} kişisine ${gidecekMiktar} bakiye gönderilmiştir. Belirtilen miktar hesabınızdan düşülmüş olup son işlem geçmişinizde "Giden Para" olarak gösterilir.`)
             ]})
            }

            
        
        
        if(interaction.options.getSubcommand() === "bilgi") {
            let uyeMmmember = interaction.options.getUser('üye')
    

            let uye = ""
             if(uyeMmmember) uye = interaction.guild.members.cache.get(uyeMmmember.id) || interaction.member
 
             else if(!uyeMmmember) uye = interaction.member
             
         
             if(uye.bot) return interaction.reply({ephemeral:true, content: "Botların bakiye bilgisi yoktur."})

             let Veri = await uyeSema.findOne({"kullanici.userID" : uye.id})
             if(!Veri) return interaction.reply({content: "Belirttiğiniz kişiye ait hiçbir veri yok! Bu, ciddi bir hatadır. Geliştirici ile iletişime geçin. Hata Kodu: DB_80"})
                    
        
        if(Veri) {     
            let sonkisi = ""

            if(Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı !== "Sistem") sonkisi = `<@${Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı}>`
                   if(Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı === "Sistem") sonkisi = "Sistem"
              

            let sonzaman = ""

            if(!Veri.kullaniciJC.BakiyeSonIslem.sonIslemZaman) sonzaman = "Kullanıcı henüz işlem yapmamış!"
            if(Veri.kullaniciJC.BakiyeSonIslem.sonIslemZaman) sonzaman = `<t:${Veri.kullaniciJC.BakiyeSonIslem.sonIslemZaman}:R>`

            

            let bakiye = Veri.kullaniciJC.Bakiye

            if(Veri.kullaniciJC.Bakiye < 0) bakiye = `*${Veri.kullaniciJC.Bakiye}* ⚠️` 
            if(Veri.kullaniciJC.Bakiye < -1999) bakiye = `*${Veri.kullaniciJC.Bakiye}* :x:` 
         

        

            let embed1 = new Discord.EmbedBuilder()
            embed1.setDescription(`${uye} kişisine ait bakiye bilgileri aşağıda belirtilmiştir:`)
            embed1.setColor('Green')
            embed1.setThumbnail(interaction.guild.iconURL())
            embed1.setFooter({iconURL: uye.avatarURL(), text: "Path of Ascension"})
            embed1.addFields(
                {name: "Bakiye", value: `${bakiye}`, inline:true},
                {name : "Son Yapılan İşlem Türü", value: `${Veri.kullaniciJC.BakiyeSonIslem.sonIslemTur}`, inline:true},
                {name : "Son İşlem Yapılan Kişi", value: `${sonkisi}`, inline:true},
                {name : "Son İşlem Zamanı", value: `${sonzaman}`, inline:true},
                {name : "Son Yapılan İşlem Miktarı", value: `${Veri.kullaniciJC.BakiyeSonIslem.sonIslemMiktar} bakiye`, inline:true}
            )
            interaction.reply({embeds: [embed1]})
        }
            }
        
    }
}


/**
 * 
 * 
 * 
 * 
 *    let uyeMmmember = interaction.options.getUser('üye')
   
    .addUserOption(option => option.setName('üye').setDescription('Bakiyesine bakılacak üyeyi belirtin.').setRequired(false)),

        let uye = ""
         if(uyeMmmember) uye = interaction.guild.members.cache.get(uyeMmmember.id) || interaction.member

         else if(!uyeMmmember) uye = interaction.member


        let Veri = await uyeSema.findOne({"kullanici.userID": uye.id})
        if(!Veri) return interaction.reply({ephemeral:true, content: "Belirtilen kullanıcıya ait hiçbir veri bulunamadı. Bu, olağan bir hata değil. Yönetim ile iletişime geçiniz.\nHATA KODU: DB_MONGO_EKONDB_KULLANICI_VERISI_MEVCUT_DEGIL_01"})


        
        if(Veri) {

            let sonİslem = "Kullanıcı henüz işlem yapmamış."

            let sonİslemKisi = ""
            if(Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı === "Sistem") sonİslemKisi === "Sistem tarafından"
            else sonİslemKisi === `<${Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı}> kişisinden`
            if(Veri.kullaniciJC.BakiyeSonIslem.sonIslemKısı === "Sistem") 
            if(Veri.kullaniciJC.BakiyeSonIslem.SonIslemTur === "alindi") sonİslem = `${sonİslemKisi}  <t:${Veri.kullaniciJC.BakiyeSonIslem.sonIslemZaman}:R> **${Veri.kullaniciJC.BakiyeSonIslem.sonIslemMiktar} JC** alınmıştır.*`
            if(Veri.kullaniciJC.BakiyeSonIslem.SonIslemTur === "verildi") sonİslem = `${sonİslemKisi} kişisine <t:${Veri.kullaniciJC.BakiyeSonIslem.sonIslemZaman}:R> **${Veri.kullaniciJC.BakiyeSonIslem.sonIslemMiktar} JC** gönderilmiştir.*`

            let embed1 = new Discord.EmbedBuilder()
            embed1.setDescription('Üye Bakiye')
            embed1.addFields(
                {name: "Bakiye", value: `${Veri.kullaniciJC.Bakiye}`, inline:true},
                {name : "Son Yapılan işlem", value: `${sonİslem}`}
            )
            interaction.reply({embeds: [embed1]})
        }
         
 */

        /** 
         *         await uyeSema.findOneAndUpdate({"kullanici.userID": uye.id}, {
                $inc: {
                    "kullaniciJC.Bakiye": +gidecekMiktar
                }
             })

             await uyeSema.findOneAndUpdate({"kullanici.userID": interaction.user.id}, {
                $inc: {
                    "kullaniciJC.Bakiye": -gidecekMiktar
                }
             })

             await uyeSema.findOneAndUpdate({"kullanici.userID": uye.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemMiktar": gidecekMiktar
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": uye.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemTur": "Gelen Para"
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": uye.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemKısı": interaction.user.id
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": uye.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemZaman": moment().unix()
                }
             })




             
             await uyeSema.findOneAndUpdate({"kullanici.userID": interaction.user.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemMiktar": gidecekMiktar
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": interaction.user.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemTur": "Giden Para"
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": interaction.user.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemKısı": uye.id
                }
             })

             
             await uyeSema.findOneAndUpdate({"kullanici.userID": interaction.user.id}, {

                $set: {
                    "kullaniciJC.BakiyeSonIslem.sonIslemZaman": moment().unix()
                }
             })

         */