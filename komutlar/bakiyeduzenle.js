const { ContextMenuCommandBuilder, ApplicationCommandType } = require('discord.js');
const Discord = require('discord.js')
const YetkiliSema = require('../mongo/PoAYetkili.js')
const uyeSema = require('../mongo/PoAUser.js');
const moment = require('moment')
module.exports = {
    // BU NE AMK
 data: new ContextMenuCommandBuilder()
	.setName('(Yetkili) Bakiye Düzenle')
	.setType(ApplicationCommandType.User),
    async execute(interaction, client) {
        if(!interaction.member.roles.cache.get('1161052492197527623')) return interaction.reply('Bu özelliği kullanmak için gerekli izinlere sahip değilsiniz.')
        if(!await YetkiliSema.findOne({userID: interaction.user.id})) {
             let yeni = await new YetkiliSema(
                {
                 userID: interaction.user.id,               
                }

            )
            await yeni.save()
        }
    
        await YetkiliSema.findOneAndUpdate({userID: interaction.user.id}, {
            $set:{

                "YetkiliBakiyeDuzenleyici.bakiyeTargetID" : interaction.targetUser.id

            }})
            await YetkiliSema.findOneAndUpdate({userID: interaction.user.id}, {
                $set:{
    
                    "YetkiliBakiyeDuzenleyici.bakiyeDuzenlenmeZamani" : moment().unix()
    
                }})
        const form = new Discord.ModalBuilder()

        .setCustomId('odemeform')
        .setTitle('Path of Ascension Bakiye Düzenleyici')
   
        let giriss = new Discord.TextInputBuilder()
        .setCustomId('uyeBakiyegirisi')
        .setLabel(`Düzenlenecek bakiye miktarını girin.`)
        .setStyle(Discord.TextInputStyle.Short)



        const secondActionRow = new Discord.ActionRowBuilder().addComponents(giriss);

        form.addComponents(secondActionRow);

        await interaction.showModal(form);


        
    


    

interaction.client.on(Discord.Events.InteractionCreate, async interaction => { 
    if (!interaction.isModalSubmit()) return;
    
    if(interaction.customId === "odemeform") {

    const bakiye = interaction.fields.getTextInputValue('uyeBakiyegirisi');
    const Veri = await YetkiliSema.findOne({userID: interaction.user.id})
    console.log(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID, bakiye);
    if(!interaction.guild.members.cache.get(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID)) {
    await interaction.reply({ephemeral:true ,content: "Belirtilen üye bulunamadı." });


    }
    else if(!await uyeSema.findOne({"kullanici.userID":Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID })) {
        await interaction.reply({ephemeral:true ,content: "Bu üyeye ait veri yok." });

    }
    else if(interaction.guild.members.cache.get(Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID)) {
        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $inc: {
                "kullaniciJC.Bakiye" : bakiye
            }
        })


        let durum = "ekleme"

        if(bakiye.startsWith('+')) durum = "eklendi"
        if(bakiye.startsWith('-')) durum = "çıkartma"

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemTur" : `Düzeltme - ${durum}`
            }
        })

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemZaman" : moment().unix()
            }
        })

        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemKısı" : "Sistem"
            }
        })
        
        await uyeSema.findOneAndUpdate({"kullanici.userID": Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}, {
            $set: {
                "kullaniciJC.BakiyeSonIslem.sonIslemMiktar" : bakiye
            }
        })
        
        


    
        interaction.reply({embeds: [
            new Discord.EmbedBuilder()
            .setDescription(`<@${Veri.YetkiliBakiyeDuzenleyici.bakiyeTargetID}> kişsinin bakiyesi başarıyla düzenlenmiştir.`)
            .setColor('DarkOrange')
            .setFooter({text: "Path of Ascension Bakiye Düzenleyici"})

        ],ephemeral: true})
    }
    }
})

    
}


}
