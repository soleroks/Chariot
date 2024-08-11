const uyeSema = require('../mongo/PoAUser.js')
const Discord = require('discord.js')
const moment = require('moment')
moment.locale('tr')
module.exports = {
    data: new Discord.SlashCommandBuilder()
    .setName('rp')   
    .setDescription('Rol bilgisi ve rol listesi komutlarını görüntüler.')
    .addSubcommand(subcommand => 
        subcommand.setName('bilgi')
        .setDescription('Belirtilen üyenin veya kişinin rol bilgilerini görüntüler.')
        .addUserOption(option=> option.setName('üye').setDescription('Rol bilgisi getirilecek üyeyi belirtin. (Kimse belirtilmez ise kendi rol bilgileriniz görüntülenir.)').setRequired(false)))

    .addSubcommand(subcommand => 
        subcommand.setName('liste')
        .setDescription('Genel veya haftalık rol listesini görüntüler.')
        .addStringOption(option =>
            option.setName('tür')
                .setDescription('Hangi rol puan türü listelensin?')
                .setRequired(true)
                .addChoices(
                    { name: 'Genel', value: 'genel' },
                    { name: 'Haftalık', value: 'haftalik' },
                
                ))
        ),
    async execute(interaction) {
 
        if(interaction.options.getSubcommand() === "bilgi") {
            let uyeMmmember = interaction.options.getUser('üye')
    

           let uye = ""
            if(uyeMmmember) uye = interaction.guild.members.cache.get(uyeMmmember.id) || interaction.member

            else if(!uyeMmmember) uye = interaction.member
            
        
            if(uye.bot) return interaction.reply({ephemeral:true, content: "Botların rol bilgisi yoktur."})
    
            const uyeBilgi = await uyeSema.findOne({"kullanici.userID": uye.id})
           
    
            if(uyeBilgi) {
                let sonPuanGenel = "Genel puan verisi yok. Henüz Rol Yazılmamış"
                let sonPuanHaftalik = "Haftalık puan verisi yok. Henüz Rol Yazılmamış"
                let sonTarih = "Son rol yazılış tarihi verisi yok."
                let sonKanal = "Son rol yazılan kanal verisi yok."
                let sonKanalURL = "Son rol yazılan mesajı verisi yok."
                if(uyeBilgi.kullaniciRP.RPPuan.genelPuan) sonPuanGenel = uyeBilgi.kullaniciRP.RPPuan.genelPuan 
                if(uyeBilgi.kullaniciRP.RPPuan.haftalikPuan)sonPuanHaftalik= uyeBilgi.kullaniciRP.RPPuan.haftalikPuan 
                if(uyeBilgi.kullaniciRP.RPBilgi.sonKanal) sonKanal = `<#${uyeBilgi.kullaniciRP.RPBilgi.sonKanal}>`
                if(uyeBilgi.kullaniciRP.RPBilgi.sonTarih) sonTarih = `<t:${uyeBilgi.kullaniciRP.RPBilgi.sonTarih}:R>`
                if(uyeBilgi.kullaniciRP.RPBilgi.sonKanalURL) sonKanalURL = `${uyeBilgi.kullaniciRP.RPBilgi.sonKanalURL} - Gitmek için tıklayın!`
            interaction.reply({embeds: [new Discord.EmbedBuilder()
            
                .setFooter({text: `${uye.displayName} kişisi için rol bilgileri görüntüleniyor.`, iconURL: uye.user.avatarURL()})
        
                .addFields(
                               
          { name: "Genel Rol Puanı", value:`${sonPuanGenel}` , inline:true},
          { name: "Haftalık Rol Puanı", value: `${sonPuanHaftalik}`, inline:true},
          { name :"Son Rol Yapma Tarihi", value: `${sonTarih}`, inline:true},
          { name: "Son Rol Yapılan Kanal", value: `${sonKanal}`, inline:true},
          { name: "Son Rol Mesajı", value: `${sonKanalURL}`, inline:true}
                    
                )
                .setColor('Green')
                .setTitle('Rol Bilgi')

        ]})
            }
        else if(!uyeBilgi) return interaction.reply({ephemeral:true,embeds: [new Discord.EmbedBuilder().setColor('Red').setTitle('Hata').setDescription('Chariot\'un veri tabanında belirtilen kişiye ait hiçbir veri bulunamadı. Eğer bu bilgi yanlış ise lütfen bu mesajı ekran görüntüsü alarak <@966439765966741514> kişisine destek etiketi yoluyla iletin.')]})
    }   
    

    
    if(interaction.options.getSubcommand() === "liste") {
        
        // GENEL ROL LİSTESİ OLUŞTURUCU
        let Veri = await uyeSema.find({})

    
        
        let avt = interaction.guild.iconURL()
        if(!avt) avt = interaction.member.user.avatarURL()
        let genelEmbed = new Discord.EmbedBuilder()
        genelEmbed.setColor('Green')
        genelEmbed.setTitle(`Path of Ascension - Genel Rol Puanı Sıralaması`)
        genelEmbed.setThumbnail(avt)
        genelEmbed.setDescription("Liste henüz oluşturulmadı.")

       
        let UyelerGenel = []

        for (let obj of Veri) {
            if(interaction.guild.members.cache
                .map((member) => member.id)
                .includes(obj.kullanici.userID)) UyelerGenel.push(obj)
        }

        UyelerGenel =  UyelerGenel.sort(function (b, a) {
            return a.kullaniciRP.RPPuan.genelPuan - b.kullaniciRP.RPPuan.genelPuan 
        })

        UyelerGenel = UyelerGenel.filter(function yeterinceBuyuk(value) {
            return value.kullaniciRP.RPPuan.genelPuan > 0
        })

        UyelerGenel = UyelerGenel.slice(0, 10)

        let desc = ""
        for (let i = 0; i < UyelerGenel.length; i++) {
           let user = interaction.client.users.cache.get(UyelerGenel[i].kullanici.userID)
           if(!user) return
           let puan = UyelerGenel[i].kullaniciRP.RPPuan.genelPuan
           desc += `${i+1}. ${user} - *${puan} puan*\n`
            
        }
        genelEmbed.setDescription(desc == "" ? "Liste henüz oluşturulmadı." :  desc)

        let toplamGenel = 0;

    

        for(var i=0; i < UyelerGenel.length; i++){

            toplamGenel += UyelerGenel[i].kullaniciRP.RPPuan.genelPuan
   
           }
        genelEmbed.setFooter({text: `${interaction.guild.name} - Toplam Rol Puanı: ${toplamGenel}`})

        let pos = 0
        for (let obj of UyelerGenel) {
            pos++
            if(obj.kullanici.userID === interaction.member.id) {
                genelEmbed.setFooter({text: `${interaction.guild.name} - Toplam Rol Puanı: ${toplamGenel} - Liste Sıranız: ${pos}`})

            }
            
        }
        let tur = interaction.options.getString('tür')

        // HAFTALIK ROL LİSTESİ OLUŞTURUCU
     
         
        let avt2 = interaction.guild.iconURL()
        if(!avt2) avt = interaction.member.user.avatarURL()
        let haftalikEmbed = new Discord.EmbedBuilder()
        haftalikEmbed.setColor('DarkGreen')
        haftalikEmbed.setTitle('Path of Ascension - Haftalık Rol Puanı Sıralaması')
        haftalikEmbed.setThumbnail(avt)
        haftalikEmbed.setDescription("Liste henüz oluşturulmadı.")


       
        let UyelerHaftalik = []

        for (let obj of Veri) {
            if(interaction.guild.members.cache
                .map((member) => member.id)
                .includes(obj.kullanici.userID)) UyelerHaftalik.push(obj)
        }

        UyelerHaftalik =  UyelerHaftalik.sort(function (b, a) {
            return a.kullaniciRP.RPPuan.haftalikPuan - b.kullaniciRP.RPPuan.haftalikPuan 
        })

        UyelerHaftalik = UyelerHaftalik.filter(function yeterinceBuyuk(value) {
            return value.kullaniciRP.RPPuan.haftalikPuan > 0
        })

        UyelerHaftalik = UyelerHaftalik.slice(0, 10)

        let desc2 = ""
        for (let i = 0; i < UyelerHaftalik.length; i++) {
           let user = interaction.client.users.cache.get(UyelerHaftalik[i].kullanici.userID)
           if(!user) return
           let puan = UyelerHaftalik[i].kullaniciRP.RPPuan.haftalikPuan
           desc2 += `${i+1}. ${user} - *${puan} puan*\n`
            
        }
        haftalikEmbed.setDescription(desc2 == "" ? "Liste henüz oluşturulmadı" :  desc2)

        let toplamHaftalik = 0 


        for(var i=0; i < UyelerHaftalik.length; i++){
            toplamHaftalik += UyelerHaftalik[i].kullaniciRP.RPPuan.genelPuan
   
           }
        haftalikEmbed.setFooter({text: `${interaction.guild.name} - Toplam Rol Puanı: ${toplamHaftalik}`})

        let pos2 = 0
        for (let obj of UyelerHaftalik) {
            pos2++
            if(obj.kullanici.userID === interaction.member.id) {
                haftalikEmbed.setFooter({text: `${interaction.guild.name} - Toplam Rol Puanı: ${toplamHaftalik} - Liste Sıralamanız: ${pos2}`})
            }
            
        }
        if(tur === "haftalik") return interaction.reply({embeds: [haftalikEmbed]})
        if(tur === "genel") return interaction.reply({embeds: [genelEmbed]})
    }
}
}
